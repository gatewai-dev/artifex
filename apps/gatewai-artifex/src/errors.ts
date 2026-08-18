export enum ExitCode {
	SUCCESS = 0,
	INPUT_ERROR = 2,
	GRAPH_ERROR = 3,
	RENDER_ERROR = 4,
	PROVIDER_ERROR = 5,
	TIMEOUT_ERROR = 6,
	FATAL_ERROR = 7,
}

export class CliError extends Error {
	public readonly exitCode: ExitCode;
	public readonly code: string;

	constructor(
		message: string,
		exitCode: ExitCode = ExitCode.INPUT_ERROR,
		code = "E_INPUT",
	) {
		super(message);
		this.name = "CliError";
		this.exitCode = exitCode;
		this.code = code;
	}
}

export function handleCliError(err: unknown, json = false): void {
	const message = err instanceof Error ? err.message : String(err);
	let exitCode = ExitCode.FATAL_ERROR;
	let code = "E_FATAL";

	if (err instanceof CliError) {
		exitCode = err.exitCode;
		code = err.code;
	} else if (
		message.includes("Spec validation failed") ||
		message.includes("requires spec.json") ||
		message.includes("Unknown command")
	) {
		exitCode = ExitCode.INPUT_ERROR;
		code = "E_INPUT";
	} else if (
		message.includes("Edge references unknown node") ||
		message.includes("not found in spec") ||
		message.includes("graph")
	) {
		exitCode = ExitCode.GRAPH_ERROR;
		code = "E_GRAPH";
	} else if (
		message.includes("Target node result does not contain") ||
		message.includes("render") ||
		message.includes("Renderer did not return")
	) {
		exitCode = ExitCode.RENDER_ERROR;
		code = "E_RENDER";
	} else if (
		message.includes("API key") ||
		message.includes("401") ||
		message.includes("Authentication")
	) {
		exitCode = ExitCode.PROVIDER_ERROR;
		code = "E_PROVIDER_NO_KEY";
	}

	if (json) {
		console.error(
			JSON.stringify({
				error: message,
				code,
				exitCode,
				stack: err instanceof Error ? err.stack : undefined,
			}),
		);
	} else {
		console.error(`✖ Error [${code}]: ${message}`);
		if (!(err instanceof CliError) && err instanceof Error && err.stack) {
			console.error(err.stack);
		}
	}

	process.exit(exitCode);
}
