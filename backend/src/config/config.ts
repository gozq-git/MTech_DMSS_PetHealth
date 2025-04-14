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

  // Zoho Mail API credentials
  zoho_email: env.ZOHO_EMAIL as string,
  zoho_client_id: env.ZOHO_CLIENT_ID as string,
  zoho_client_secret: env.ZOHO_CLIENT_SECRET as string,
  zoho_refresh_token: env.ZOHO_REFRESH_TOKEN as string,
  zoho_account_id: env.ZOHO_ACCOUNT_ID as string,

  telegram_bot_token: env.TELEGRAM_BOT_TOKEN as string,

  port: 8001,
  wssport: 8090,
};