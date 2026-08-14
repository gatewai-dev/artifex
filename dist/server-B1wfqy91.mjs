import { c as logger } from "./dist-DwwocMHt.mjs";
import { injectable } from "inversify";

//#region ../../packages/node-sdk/dist/server.mjs
/**
* Define a backend node implementation.
* This should be used in the `node.ts` file of a node package.
*/
function defineNode(metadata, plugin) {
	return Object.freeze({
		...metadata,
		...plugin
	});
}
var ServerPassthroughProcessor = class {
	process(ctx) {
		return Promise.resolve({
			newResult: ctx.node.result,
			success: true
		});
	}
};
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let NodeRegistry = class NodeRegistry$1 {
	processors = /* @__PURE__ */ new Map();
	manifests = /* @__PURE__ */ new Map();
	hasErrors = false;
	/**
	* Register a node manifest. If it has a backendProcessor,
	* that processor will be registered for execution.
	*/
	register(manifest) {
		if (this.manifests.has(manifest.type)) logger.warn(`[NodeRegistry] Overwriting existing registration for node type: ${manifest.type}`);
		this.manifests.set(manifest.type, manifest);
		if (manifest.backendProcessor) this.processors.set(manifest.type, manifest.backendProcessor);
	}
	/**
	* Register a raw processor function for a node type.
	* Used for inline/passthrough processors that don't have full manifests.
	*/
	registerProcessor(type, processor) {
		this.processors.set(type, processor);
	}
	/**
	* Get the processor for a node type.
	*/
	getProcessor(type) {
		return this.processors.get(type);
	}
	/**
	* Get the manifest for a node type.
	*/
	getManifest(type) {
		return this.manifests.get(type);
	}
	/**
	* Get all registered manifests.
	*/
	getAllManifests() {
		return Array.from(this.manifests.values());
	}
	/**
	* Check if a processor is registered for a node type.
	*/
	hasProcessor(type) {
		return this.processors.has(type);
	}
	/**
	* Get the count of registered processors.
	*/
	get processorCount() {
		return this.processors.size;
	}
	/**
	* Get the count of registered manifests.
	*/
	get manifestCount() {
		return this.manifests.size;
	}
	/**
	* Run all registered node migrations.
	* Iterates manifests that define migrations, sorts them deterministically,
	* and executes them sequentially under a distributed advisory lock.
	*/
	async runMigrations(prisma) {
		const migratable = this.getAllManifests().filter((m) => m.migrations && m.migrations.length > 0);
		if (migratable.length === 0) return;
		const allMigrations = [];
		for (const manifest of migratable) {
			const migrations = manifest.migrations || [];
			for (const def of migrations) {
				if (!def.migrationName) {
					logger.warn(`[NodeRegistry] Migration function in node ${manifest.type} is missing 'migrationName' property. Skipping.`);
					continue;
				}
				allMigrations.push({
					manifest,
					def
				});
			}
		}
		allMigrations.sort((a, b) => a.def.migrationName.localeCompare(b.def.migrationName));
		logger.info(`[NodeRegistry] Checking/running ${allMigrations.length} migration(s)...`);
		for (const { manifest, def } of allMigrations) {
			const name = def.migrationName;
			try {
				let hash = 0;
				for (let i = 0; i < name.length; i++) {
					hash = (hash << 5) - hash + name.charCodeAt(i);
					hash |= 0;
				}
				await prisma.$transaction(async (tx) => {
					await tx.$executeRaw`SELECT pg_advisory_xact_lock(${hash})`;
					if (await tx.nodeMigration.findUnique({ where: { name } })) {
						logger.debug(`[NodeRegistry] Skip migration: '${name}' (already applied)`);
						return;
					}
					logger.info(`[NodeRegistry] Running migration '${name}' for node type ${manifest.type}...`);
					await def(tx);
					await tx.nodeMigration.create({ data: { name } });
				}, { timeout: 6e4 });
				logger.info(`[NodeRegistry] Migration completed: '${name}'`);
			} catch (err) {
				this.hasErrors = true;
				logger.error({
					err,
					nodeType: manifest.type,
					migrationName: name
				}, `[NodeRegistry] Migration failed: '${name}'`);
				throw err;
			}
		}
	}
};
NodeRegistry = __decorate([injectable()], NodeRegistry);
let SkillRegistry = class SkillRegistry$1 {
	summaries = /* @__PURE__ */ new Map();
	contents = /* @__PURE__ */ new Map();
	/**
	* Register a node skill.
	*/
	register(entry) {
		this.summaries.set(entry.nodeType, {
			nodeType: entry.nodeType,
			name: entry.name,
			summary: entry.summary,
			triggers: entry.triggers
		});
		this.contents.set(entry.nodeType, entry.content);
	}
	/**
	* Get all summaries — used for the orchestrator system prompt index.
	*/
	getAllSummaries() {
		return Array.from(this.summaries.values());
	}
	/**
	* Get a single summary by nodeType.
	*/
	getSummary(nodeType) {
		return this.summaries.get(nodeType);
	}
	/**
	* Get the full skill content for a nodeType.
	*/
	getContent(nodeType) {
		return this.contents.get(nodeType);
	}
	/**
	* Check if a skill exists for a nodeType.
	*/
	has(nodeType) {
		return this.summaries.has(nodeType);
	}
	/**
	* Get the count of registered skills.
	*/
	get count() {
		return this.summaries.size;
	}
};
SkillRegistry = __decorate([injectable()], SkillRegistry);

//#endregion
export { defineNode as i, ServerPassthroughProcessor as n, SkillRegistry as r, NodeRegistry as t };