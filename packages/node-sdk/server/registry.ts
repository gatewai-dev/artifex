import { inject, injectable, optional } from "inversify";
import type {
	BackendNodePlugin,
	MigrationDatabase,
	NodeMigrateFn,
	NodeProcessorConstructor,
} from "./types.js";

/**
 * Minimal logger interface for NodeRegistry.
 */
export interface RegistryLogger {
	info: (msg: string, ...args: any[]) => void;
	warn: (msg: string, ...args: any[]) => void;
	error: (objOrMsg: any, msg?: string) => void;
	debug: (msg: string, ...args: any[]) => void;
}

const defaultLogger: RegistryLogger = {
	info: (msg: string, ...args: any[]) =>
		console.info(`[NodeRegistry] ${msg}`, ...args),
	warn: (msg: string, ...args: any[]) =>
		console.warn(`[NodeRegistry] ${msg}`, ...args),
	error: (objOrMsg: any, msg?: string) =>
		console.error(`[NodeRegistry] ${msg ?? ""}`, objOrMsg),
	debug: () => {},
};

/**
 * Central registry for node processors and manifests.
 */
@injectable()
export class NodeRegistry {
	private processors = new Map<string, NodeProcessorConstructor>();
	private manifests = new Map<string, BackendNodePlugin>();
	public hasErrors = false;
	private logger: RegistryLogger;

	constructor(
		@inject(Symbol.for("LOGGER")) @optional() customLogger?: RegistryLogger,
	) {
		this.logger = customLogger ?? defaultLogger;
	}

	/**
	 * Register a node manifest. If it has a backendProcessor,
	 * that processor will be registered for execution.
	 */
	register(manifest: BackendNodePlugin): void {
		if (this.manifests.has(manifest.type)) {
			this.logger.warn(
				`Overwriting existing registration for node type: ${manifest.type}`,
			);
		}

		this.manifests.set(manifest.type, manifest);

		if (manifest.backendProcessor) {
			this.processors.set(manifest.type, manifest.backendProcessor);
		}
	}

	/**
	 * Register a raw processor function for a node type.
	 * Used for inline/passthrough processors that don't have full manifests.
	 */
	registerProcessor(type: string, processor: NodeProcessorConstructor): void {
		this.processors.set(type, processor);
	}

	/**
	 * Get the processor for a node type.
	 */
	getProcessor(type: string): NodeProcessorConstructor | undefined {
		return this.processors.get(type);
	}

	/**
	 * Get the manifest for a node type.
	 */
	getManifest(type: string): BackendNodePlugin | undefined {
		return this.manifests.get(type);
	}

	/**
	 * Get all registered manifests.
	 */
	getAllManifests(): BackendNodePlugin[] {
		return Array.from(this.manifests.values());
	}

	/**
	 * Check if a processor is registered for a node type.
	 */
	hasProcessor(type: string): boolean {
		return this.processors.has(type);
	}

	/**
	 * Get the count of registered processors.
	 */
	get processorCount(): number {
		return this.processors.size;
	}

	/**
	 * Get the count of registered manifests.
	 */
	get manifestCount(): number {
		return this.manifests.size;
	}

	/**
	 * Run all registered node migrations.
	 * Iterates manifests that define migrations, sorts them deterministically,
	 * and executes them sequentially under a distributed advisory lock.
	 */
	async runMigrations(db: MigrationDatabase): Promise<void> {
		const migratable = this.getAllManifests().filter(
			(m) => m.migrations && m.migrations.length > 0,
		);
		if (migratable.length === 0) return;

		// 1. Gather all migrations and sort alphabetically/lexicographically to guarantee deterministic execution order
		const allMigrations: Array<{
			manifest: BackendNodePlugin;
			def: NodeMigrateFn;
		}> = [];

		for (const manifest of migratable) {
			const migrations = manifest.migrations || [];
			for (const def of migrations) {
				if (!def.migrationName) {
					this.logger.warn(
						`Migration function in node ${manifest.type} is missing 'migrationName' property. Skipping.`,
					);
					continue;
				}
				allMigrations.push({ manifest, def });
			}
		}

		allMigrations.sort((a, b) =>
			a.def.migrationName.localeCompare(b.def.migrationName),
		);

		this.logger.info(
			`Checking/running ${allMigrations.length} migration(s)...`,
		);

		for (const { manifest, def } of allMigrations) {
			const name = def.migrationName;

			try {
				// Hash the name to a 32-bit integer for pg_advisory_xact_lock
				let hash = 0;
				for (let i = 0; i < name.length; i++) {
					hash = (hash << 5) - hash + name.charCodeAt(i);
					hash |= 0;
				}

				// Run inside a transaction with a generous timeout for data safety
				await db.$transaction(
					async (tx: any) => {
						// Acquire a transaction-level advisory lock to serialize concurrent server startups
						await tx.$executeRaw`SELECT pg_advisory_xact_lock(${hash})`;

						// Double-check if already run after acquiring the lock
						const existing = await tx.nodeMigration.findUnique({
							where: { name },
						});

						if (existing) {
							this.logger.debug(`Skip migration: '${name}' (already applied)`);
							return;
						}

						this.logger.info(
							`Running migration '${name}' for node type ${manifest.type}...`,
						);

						await def(tx);

						await tx.nodeMigration.create({
							data: { name },
						});
					},
					{
						timeout: 60000, // 60 seconds
					},
				);

				this.logger.info(`Migration completed: '${name}'`);
			} catch (err) {
				this.hasErrors = true;
				this.logger.error(
					err,
					`Migration failed: '${name}' for node type ${manifest.type}`,
				);
				// Fail-fast: throw the error to halt further migrations and prevent data inconsistency
				throw err;
			}
		}
	}
}
