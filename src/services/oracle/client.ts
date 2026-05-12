import type { BindParameters, Connection, Pool, Result } from "oracledb";
import { getOracleConfig } from "./config";
import { isRetryableOracleError } from "./errors";

type OracleDbModule = typeof import("oracledb");
type OracleDbImport = OracleDbModule & {
  default?: OracleDbModule;
};

type OracleGlobal = typeof globalThis & {
  oraclePoolPromise?: Promise<Pool>;
  oracleDbModulePromise?: Promise<OracleDbModule>;
};

const globalForOracle = globalThis as OracleGlobal;

async function loadOracleDb(): Promise<OracleDbModule> {
  if (!globalForOracle.oracleDbModulePromise) {
    globalForOracle.oracleDbModulePromise = import("oracledb").then(
      (module) => (module as OracleDbImport).default ?? module
    );
  }

  return globalForOracle.oracleDbModulePromise;
}

async function createPool() {
  const oracledb = await loadOracleDb();
  const config = getOracleConfig();

  return oracledb.createPool({
    user: config.user,
    password: config.password,
    connectString: config.connectString,
    poolMin: config.poolMin,
    poolMax: config.poolMax,
    poolIncrement: config.poolIncrement,
    poolTimeout: config.poolTimeout,
    queueMax: config.poolMax * 4,
    queueTimeout: config.queueTimeout,
    stmtCacheSize: 50,
  });
}

export function getOraclePool() {
  if (!globalForOracle.oraclePoolPromise) {
    globalForOracle.oraclePoolPromise = createPool();
  }

  return globalForOracle.oraclePoolPromise;
}

async function getConnection() {
  const pool = await getOraclePool();
  const connection = await pool.getConnection();

  connection.callTimeout = getOracleConfig().callTimeout;

  return connection;
}

export async function withOracleConnection<T>(
  handler: (connection: Connection) => Promise<T>,
  options: { retries?: number } = {}
) {
  const retries = options.retries ?? 1;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    let connection: Connection | null = null;

    try {
      connection = await getConnection();
      return await handler(connection);
    } catch (error) {
      lastError = error;

      if (!isRetryableOracleError(error) || attempt === retries) {
        throw error;
      }

      globalForOracle.oraclePoolPromise = undefined;
    } finally {
      if (connection) {
        await connection.close().catch(() => undefined);
      }
    }
  }

  throw lastError;
}

export async function executeOracle<T extends Record<string, unknown>>(
  sql: string,
  binds: BindParameters = {}
) {
  const oracledb = await loadOracleDb();

  return withOracleConnection(async (connection) => {
    const result = await connection.execute<T>(sql, binds, {
      autoCommit: false,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      maxRows: 1000,
    });

    return result as Result<T>;
  });
}
