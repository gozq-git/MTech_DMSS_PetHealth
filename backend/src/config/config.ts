const env = process.env;

export const config = {
  env: env.NODE_ENV,
  logLevel: env.LOG_LEVEL,
  tennat_id: env.TENANT_ID,
  port: 8000,
};