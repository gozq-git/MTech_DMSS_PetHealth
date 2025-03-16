"use strict";
module.exports = {
    apps: [{
            name: "php-backend",
            script: "./server.js",
            env_production: {
                NODE_ENV: "production",
                LOG_LEVEL: "info",
            },
            env_development: {
                NODE_ENV: "development",
                LOG_LEVEL: "debug",
            }
        }]
};
