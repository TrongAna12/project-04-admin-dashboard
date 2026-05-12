import { z } from "zod";

const oracleEnvSchema = z.object({
  ORACLE_USER: z.string().min(1),
  ORACLE_PASSWORD: z.string().min(1),
  ORACLE_CONNECT_STRING: z.string().min(1),
  ORACLE_POOL_MIN: z.coerce.number().int().min(0).default(1),
  ORACLE_POOL_MAX: z.coerce.number().int().min(1).max(50).default(5),
  ORACLE_POOL_INCREMENT: z.coerce.number().int().min(1).max(10).default(1),
  ORACLE_POOL_TIMEOUT_SECONDS: z.coerce.number().int().min(30).default(60),
  ORACLE_QUEUE_TIMEOUT_MS: z.coerce.number().int().min(500).default(5000),
  ORACLE_QUERY_TIMEOUT_MS: z.coerce.number().int().min(1000).default(15000),
});

export function getOracleConfig() {
  const result = oracleEnvSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(
      "Oracle environment is not configured. Set ORACLE_USER, ORACLE_PASSWORD, and ORACLE_CONNECT_STRING in .env.local."
    );
  }

  const config = result.data;

  return {
    user: config.ORACLE_USER,
    password: config.ORACLE_PASSWORD,
    connectString: config.ORACLE_CONNECT_STRING,
    poolMin: config.ORACLE_POOL_MIN,
    poolMax: Math.max(config.ORACLE_POOL_MAX, config.ORACLE_POOL_MIN),
    poolIncrement: config.ORACLE_POOL_INCREMENT,
    poolTimeout: config.ORACLE_POOL_TIMEOUT_SECONDS,
    queueTimeout: config.ORACLE_QUEUE_TIMEOUT_MS,
    callTimeout: config.ORACLE_QUERY_TIMEOUT_MS,
  };
}
