import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.join(__dirname ,'/.env')});  // Load environment variables from .env file

const env = process.env;

export const config = {
  env: env.NODE_ENV as string,
  logLevel: env.LOG_LEVEL as string,
  tennat_id: env.TENANT_ID as string,
  db_host: env.DB_HOST as string,
  db_user: env.DB_USER as string,
  db_password: env.DB_PASSWORD as string,
  db_name: env.DB_NAME as string,
  port: 8001,
  wssport: 8090,
};