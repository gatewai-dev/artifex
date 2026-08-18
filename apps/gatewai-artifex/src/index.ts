#!/usr/bin/env node

(globalThis as any).__IS_HEADLESS_RENDERER__ = true;

import { ensureEnvDefaults } from "./env.js";

ensureEnvDefaults();

// Import main dynamically to ensure env defaults are in place before other modules evaluate
const { main } = await import("./main.js");
await main();

process.exit(0);
