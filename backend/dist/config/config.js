"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '/.env') }); // Load environment variables from .env file
const env = process.env;
exports.config = {
    env: env.NODE_ENV,
    logLevel: env.LOG_LEVEL,
    tennat_id: env.TENANT_ID,
    db_host: env.DB_HOST,
    db_user: env.DB_USER,
    db_password: env.DB_PASSWORD,
    db_name: env.DB_NAME,
    // Zoho Mail API credentials
    zoho_email: env.ZOHO_EMAIL,
    zoho_client_id: env.ZOHO_CLIENT_ID,
    zoho_client_secret: env.ZOHO_CLIENT_SECRET,
    zoho_refresh_token: env.ZOHO_REFRESH_TOKEN,
    zoho_account_id: env.ZOHO_ACCOUNT_ID,
    telegram_bot_token: env.TELEGRAM_BOT_TOKEN,
    ntfy_url: 'https://ntfy.sh',
    port: 8001,
    wssport: 8090,
};
