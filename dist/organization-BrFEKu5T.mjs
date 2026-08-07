import { M as APIError } from "./tracer-k_BJ35P7.mjs";
import { t as createAccessControl } from "./access-Dtj6wM8x.mjs";
import * as z$2 from "zod";

//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/plugins/organization/access/statement.mjs
const defaultStatements = {
	organization: ["update", "delete"],
	member: [
		"create",
		"update",
		"delete"
	],
	invitation: ["create", "cancel"],
	team: [
		"create",
		"update",
		"delete"
	],
	ac: [
		"create",
		"read",
		"update",
		"delete"
	]
};
const defaultAc = createAccessControl(defaultStatements);
const adminAc = defaultAc.newRole({
	organization: ["update"],
	invitation: ["create", "cancel"],
	member: [
		"create",
		"update",
		"delete"
	],
	team: [
		"create",
		"update",
		"delete"
	],
	ac: [
		"create",
		"read",
		"update",
		"delete"
	]
});
const ownerAc = defaultAc.newRole({
	organization: ["update", "delete"],
	member: [
		"create",
		"update",
		"delete"
	],
	invitation: ["create", "cancel"],
	team: [
		"create",
		"update",
		"delete"
	],
	ac: [
		"create",
		"read",
		"update",
		"delete"
	]
});
const memberAc = defaultAc.newRole({
	organization: [],
	member: [],
	invitation: [],
	team: [],
	ac: ["read"]
});
const defaultRoles = {
	admin: adminAc,
	owner: ownerAc,
	member: memberAc
};

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/plugins/organization/permission.mjs
const hasPermissionFn = (input, acRoles) => {
	if (!input.permissions) return false;
	const roles = input.role.split(",");
	const creatorRole = input.options.creatorRole || "owner";
	const isCreator = roles.includes(creatorRole);
	const allowCreatorsAllPermissions = input.allowCreatorAllPermissions || false;
	if (isCreator && allowCreatorsAllPermissions) return true;
	for (const role of roles) if ((acRoles[role]?.authorize(input.permissions))?.success) return true;
	return false;
};
const cacheAllRoles = /* @__PURE__ */ new Map();

//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.26_@opentelemetry+api@1.9.0_@prisma+client@6.19.2_prisma@6.19.2_typescr_0d58c320269e19d5f9ff73febfb8f348/node_modules/better-auth/dist/plugins/organization/has-permission.mjs
const hasPermission = async (input, ctx) => {
	let acRoles = { ...input.options.roles || defaultRoles };
	if (ctx && input.organizationId && input.options.dynamicAccessControl?.enabled && input.options.ac && !input.useMemoryCache) {
		const roles = await ctx.context.adapter.findMany({
			model: "organizationRole",
			where: [{
				field: "organizationId",
				value: input.organizationId
			}]
		});
		for (const { role, permission: permissionsString } of roles) {
			const result = z$2.record(z$2.string(), z$2.array(z$2.string())).safeParse(JSON.parse(permissionsString));
			if (!result.success) {
				ctx.context.logger.error("[hasPermission] Invalid permissions for role " + role, { permissions: JSON.parse(permissionsString) });
				throw new APIError("INTERNAL_SERVER_ERROR", { message: "Invalid permissions for role " + role });
			}
			const merged = { ...acRoles[role]?.statements };
			for (const [key, actions] of Object.entries(result.data)) merged[key] = [.../* @__PURE__ */ new Set([...merged[key] ?? [], ...actions])];
			acRoles[role] = input.options.ac.newRole(merged);
		}
	}
	if (input.useMemoryCache) acRoles = cacheAllRoles.get(input.organizationId) || acRoles;
	cacheAllRoles.set(input.organizationId, acRoles);
	return hasPermissionFn(input, acRoles);
};

//#endregion
export { hasPermission };