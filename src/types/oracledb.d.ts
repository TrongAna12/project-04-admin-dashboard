declare module "oracledb" {
  export type BindValue = string | number | Date | null;
  export type BindParameters = Record<string, BindValue>;

  export type ExecuteOptions = {
    autoCommit?: boolean;
    maxRows?: number;
    outFormat?: number;
  };

  export type Result<T> = {
    rows?: T[];
  };

  export type Connection = {
    callTimeout: number;
    execute<T>(
      sql: string,
      binds?: BindParameters,
      options?: ExecuteOptions
    ): Promise<Result<T>>;
    close(): Promise<void>;
  };

  export type Pool = {
    getConnection(): Promise<Connection>;
  };

  export type PoolAttributes = {
    user: string;
    password: string;
    connectString: string;
    poolMin: number;
    poolMax: number;
    poolIncrement: number;
    poolTimeout: number;
    queueMax: number;
    queueTimeout: number;
    stmtCacheSize: number;
  };

  export const OUT_FORMAT_OBJECT: number;
  export const CLOB: number;

  export function createPool(attributes: PoolAttributes): Promise<Pool>;
}
