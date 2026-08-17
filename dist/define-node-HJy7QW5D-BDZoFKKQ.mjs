import { u as NodeMetadataSchema } from "./dist-DSiNOGGx.mjs";

//#region ../../packages/node-sdk/dist/define-node-HJy7QW5D.mjs
/**
* Define the shared metadata for a node.
* This should be used in the `metadata.ts` file of a node package.
*/
function defineMetadata(metadata) {
	return Object.freeze(NodeMetadataSchema.parse(metadata));
}

//#endregion
export { defineMetadata as t };