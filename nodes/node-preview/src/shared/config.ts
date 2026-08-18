import { z } from "zod";

export const PreviewNodeConfigSchema = z.object({}).strict();

import { type NodeResult, NodeResultSchema } from "@gatewai.studio/core";
export const PreviewResultSchema = NodeResultSchema;
export type PreviewResult = NodeResult;
