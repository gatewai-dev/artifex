#!/usr/bin/env node
import { t as ensureEnvDefaults } from "./env-Dfb8nXhL.mjs";

//#region src/index.ts
globalThis.__IS_HEADLESS_RENDERER__ = true;
ensureEnvDefaults();
const { main } = await import("./main-CHfAzadS.mjs");
await main();
process.exit(0);

//#endregion
export {  };