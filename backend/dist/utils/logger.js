"use strict";
const log4js = require("log4js");
const { config } = require('../config/config');
log4js.configure({
    appenders: { console: { type: "console" } },
    categories: { default: { appenders: ["console"], level: "debug" } }
});
const logger = log4js.getLogger();
logger.level = config.logLevel;
logger.info(`Logger level set to: ${logger.level}`);
module.exports = logger;
