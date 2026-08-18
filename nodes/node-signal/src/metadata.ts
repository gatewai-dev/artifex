import { defineMetadata } from "@gatewai.studio/node-sdk";
import { SignalNodeConfigSchema, SignalResultSchema } from "./shared/index.js";

export { SignalNodeConfigSchema, SignalResultSchema };

export const metadata = defineMetadata({
	type: "ProceduralSignal",
	displayName: "Procedural Signal",
	description: "Create procedural Signals.",
	category: "Signal",
	showInQuickAccess: false,
	configSchema: SignalNodeConfigSchema,
	resultSchema: SignalResultSchema,
	isTerminal: false,
	isTransient: true,
	handles: {
		inputs: [],
		outputs: [{ dataTypes: ["Signal"], label: "Result", order: 0 }],
	},
	defaultConfig: {
		amplitude: 1,
		frequency: 1,
		phase: 0,
		offset: 0,
		fnBody: [
			"// Bindings: t: f32 | x y z: f32 | i n frame: u32",
			"// Constants: PI, TAU, E",
			"return u.amplitude * sin(t * u.frequency * TAU + u.phase) + u.offset;",
		].join("\n"),
		fnOutputType: "f32",
		fnParams: [],
	},
});
