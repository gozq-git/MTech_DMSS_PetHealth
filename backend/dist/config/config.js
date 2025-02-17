"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const env = process.env;
exports.config = {
    env: env.NODE_ENV,
    logLevel: env.LOG_LEVEL,
    tennat_id: env.TENANT_ID,
    port: 8000,
};
