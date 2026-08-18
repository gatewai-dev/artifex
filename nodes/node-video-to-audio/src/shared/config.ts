import { AudioResultSchema } from "@gatewai.studio/node-sdk";
import { z } from "zod";

export const VideoToAudioNodeConfigSchema = z.object({}).strict();

export type VideoToAudioNodeConfig = z.infer<
	typeof VideoToAudioNodeConfigSchema
>;

export const VideoToAudioResultSchema = AudioResultSchema;

export type VideoToAudioResult = z.infer<typeof VideoToAudioResultSchema>;
