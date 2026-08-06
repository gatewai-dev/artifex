import { i as SqliteDialect, n as PostgresDialect, r as MysqlDialect, t as MssqlDialect, u as Kysely } from "./esm-CqG1T4wJ.mjs";

//#region ../../node_modules/.pnpm/better-auth@1.4.19_@prisma+client@6.19.2_prisma@6.19.2_typescript@5.8.3__typescript@5.8_3200ff0b081ca9ebb67fbd16cd8fe89f/node_modules/better-auth/dist/adapters/kysely-adapter/dialect.mjs
function getKyselyDatabaseType(db) {
	if (!db) return null;
	if ("dialect" in db) return getKyselyDatabaseType(db.dialect);
	if ("createDriver" in db) {
		if (db instanceof SqliteDialect) return "sqlite";
		if (db instanceof MysqlDialect) return "mysql";
		if (db instanceof PostgresDialect) return "postgres";
		if (db instanceof MssqlDialect) return "mssql";
	}
	if ("aggregate" in db) return "sqlite";
	if ("getConnection" in db) return "mysql";
	if ("connect" in db) return "postgres";
	if ("fileControl" in db) return "sqlite";
	if ("open" in db && "close" in db && "prepare" in db) return "sqlite";
	return null;
}
const createKyselyAdapter = async (config) => {
	const db = config.database;
	if (!db) return {
		kysely: null,
		databaseType: null,
		transaction: void 0
	};
	if ("db" in db) return {
		kysely: db.db,
		databaseType: db.type,
		transaction: db.transaction
	};
	if ("dialect" in db) return {
		kysely: new Kysely({ dialect: db.dialect }),
		databaseType: db.type,
		transaction: db.transaction
	};
	let dialect = void 0;
	const databaseType = getKyselyDatabaseType(db);
	if ("createDriver" in db) dialect = db;
	if ("aggregate" in db && !("createSession" in db)) dialect = new SqliteDialect({ database: db });
	if ("getConnection" in db) dialect = new MysqlDialect(db);
	if ("connect" in db) dialect = new PostgresDialect({ pool: db });
	if ("fileControl" in db) {
		const { BunSqliteDialect } = await import("./bun-sqlite-dialect-D94E68pK.mjs");
		dialect = new BunSqliteDialect({ database: db });
	}
	if ("createSession" in db) {
		let DatabaseSync = void 0;
		try {
			const nodeSqlite = "node:sqlite";
			({DatabaseSync} = await import(
				/* @vite-ignore */
				/* webpackIgnore: true */
				nodeSqlite
));
		} catch (error) {
			if (error !== null && typeof error === "object" && "code" in error && error.code !== "ERR_UNKNOWN_BUILTIN_MODULE") throw error;
		}
		if (DatabaseSync && db instanceof DatabaseSync) {
			const { NodeSqliteDialect } = await import("./node-sqlite-dialect-HFTlr0bH.mjs");
			dialect = new NodeSqliteDialect({ database: db });
		}
	}
	return {
		kysely: dialect ? new Kysely({ dialect }) : null,
		databaseType,
		transaction: void 0
	};
};

//#endregion
export { getKyselyDatabaseType as n, createKyselyAdapter as t };