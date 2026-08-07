#!/usr/bin/env node
import { t as ensureEnvDefaults } from "./env-CCT1yCAD.mjs";

//#region src/index.ts
globalThis.__IS_HEADLESS_RENDERER__ = true;
ensureEnvDefaults();
const { main } = await import("./main-CnWIevEv.mjs");
await main();
process.exit(0);

//#endregion
export {  };