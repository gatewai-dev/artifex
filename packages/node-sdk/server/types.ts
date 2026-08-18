import type {
	AIProvider,
	DataType,
	HandleType,
	IGraphResolverService,
	MediaService,
	NodeMetadata,
	NodeResult,
	StorageService,
} from "@gatewai.studio/core";
import type { Env, Hono, Schema } from "hono";

/**
 * Input filter options used by graph resolver functions.
 */
export interface InputFilterOptions {
	dataType?: DataType;
	label?: string;
}

// Re-export so consumers don't need to import from @gatewai.studio/core directly if they don't want to
export type {
	AIProvider,
	DataType,
	HandleType,
	IGraphResolverService,
	MediaService,
	NodeMetadata,
	StorageService,
};

/**
 * Structural representation of a graph canvas.
 */
export interface GraphCanvas {
	id: string;
	name?: string;
	userId: string;
	[key: string]: unknown;
}

/**
 * Structural representation of a graph handle.
 */
export interface GraphHandle {
	id: string;
	nodeId: string;
	type: HandleType;
	dataTypes: DataType[];
	label: string;
	order?: number;
	required?: boolean;
	templateHandleId?: string | null;
	description?: string | null;
	createdAt?: Date | string;
	updatedAt?: Date | string;
	[key: string]: unknown;
}

/**
 * Structural representation of a graph node template.
 */
export interface GraphNodeTemplate {
	id: string;
	type: string;
	name?: string;
	displayName?: string;
	category?: string | null;
	[key: string]: unknown;
}

/**
 * Structural representation of a graph node.
 */
export interface GraphNode {
	id: string;
	name: string;
	type: string;
	position?: { x: number; y: number } | unknown;
	config?: unknown;
	result?: unknown;
	templateId?: string;
	template?: GraphNodeTemplate;
	handles?: GraphHandle[];
	locked?: boolean;
	[key: string]: unknown;
}

/**
 * Structural representation of a graph edge.
 */
export interface GraphEdge {
	id?: string;
	source: string;
	target: string;
	sourceHandleId?: string | null;
	targetHandleId?: string | null;
	[key: string]: unknown;
}

/**
 * Structural representation of an execution task.
 */
export interface GraphTask {
	id: string;
	name?: string;
	status?: string | null;
	nodeId?: string | null;
	canvasId?: string | null;
	[key: string]: unknown;
}

/**
 * Data context passed to a backend node processor during execution.
 * Contains the full canvas state, task info, database client, and injected services.
 */
export interface BackendNodeProcessorCtx<TConfig = unknown, TResult = unknown> {
	/** The node instance being processed */
	node: GraphNode & {
		result: TResult;
		config: TConfig;
		template: GraphNodeTemplate;
	};
	/** Full canvas context including nodes, edges, handles, tasks */
	data: {
		canvas: GraphCanvas;
		nodes: Array<GraphNode & { template: GraphNodeTemplate }>;
		edges: Array<GraphEdge>;
		handles: Array<GraphHandle>;
		tasks: Array<GraphTask>;
		task?: GraphTask;
		apiKey?: string;
		isApiBatch?: boolean;
	};
	/** Abort signal that fires when the job is cancelled or removed */
	abortSignal?: AbortSignal;
}

/**
 * Result returned by a backend node processor.
 */
export interface BackendNodeProcessorResult<T = NodeResult> {
	success: boolean;
	error?: string;
	errorType?: string;
	newResult?: T;
}

/**
 * Interface that class-based node processors must implement.
 */
export interface NodeProcessor {
	process(ctx: BackendNodeProcessorCtx): Promise<BackendNodeProcessorResult>;
}

/**
 * Type alias for a class constructor implementing NodeProcessor.
 */
export type NodeProcessorConstructor = new (...args: any[]) => NodeProcessor;

/**
 * Generic database client interface for node migrations.
 */
export interface MigrationDatabase {
	$executeRaw: (query: TemplateStringsArray, ...values: any[]) => Promise<any>;
	$transaction: <T>(
		fn: (tx: any) => Promise<T>,
		options?: { timeout?: number },
	) => Promise<T>;
	nodeMigration: {
		findUnique: (args: {
			where: { name: string };
		}) => Promise<{ name: string } | null>;
		create: (args: { data: { name: string } }) => Promise<any>;
	};
	[key: string]: any;
}

/**
 * Function type for node migration.
 * Receives a generic database client and can run arbitrary DB operations to migrate
 * stale data (e.g., updating removed model IDs in node configs).
 * The function must have a static property `migrationName: string` to identify and track it.
 */
export type NodeMigrateFn = ((db: MigrationDatabase) => Promise<void>) & {
	migrationName: string;
};

/**
 * Backend-specific plugin definition.
 */
export interface BackendNodePlugin<
	E extends Env = any,
	S extends Schema = any,
	P extends string = string,
> extends NodeMetadata {
	backendProcessor: NodeProcessorConstructor;
	/**
	 * The optional backend route
	 */
	route?: Hono<E, S, P>;
	/**
	 * Optional list of migration functions that run at server startup during node registration.
	 * Handled sequentially, tracked in database by their `migrationName` property to run exactly once.
	 */
	migrations?: NodeMigrateFn[];
}
