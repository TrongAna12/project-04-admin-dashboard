export class OracleServiceError extends Error {
  public readonly originalError?: unknown;

  constructor(
    message: string,
    public readonly status = 500,
    public readonly code = "ORACLE_SERVICE_ERROR",
    originalError?: unknown
  ) {
    super(message);
    this.name = "OracleServiceError";
    this.originalError = originalError;
  }
}

export function isRetryableOracleError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return [
    "ORA-03113",
    "ORA-03114",
    "ORA-03135",
    "ORA-12170",
    "ORA-12514",
    "ORA-12541",
    "DPI-1010",
    "DPI-1080",
    "NJS-040",
    "NJS-500",
  ].some((code) => message.includes(code));
}

export function toOracleServiceError(error: unknown) {
  if (error instanceof OracleServiceError) {
    return error;
  }

  const message =
    error instanceof Error ? error.message : String(error);

  console.error("ORACLE RAW ERROR =>", error);

  if (message.includes("environment is not configured")) {
    return new OracleServiceError(
      message,
      503,
      "ORACLE_CONFIG_MISSING",
      error
    );
  }

  if (
    message.includes("DPI-1067") ||
    message.includes("DPI-1080")
  ) {
    return new OracleServiceError(
      "Oracle query timed out.",
      504,
      "ORACLE_TIMEOUT",
      error
    );
  }

  if (isRetryableOracleError(error)) {
    return new OracleServiceError(
      "Oracle connection is temporarily unavailable.",
      503,
      "ORACLE_UNAVAILABLE",
      error
    );
  }

  return new OracleServiceError(
    message,
    500,
    "ORACLE_QUERY_FAILED",
    error
  );
}