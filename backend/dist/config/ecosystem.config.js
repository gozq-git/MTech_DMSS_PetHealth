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
                TENANT_ID: "f1cc8e83-bd27-4a47-96c7-98ccb23ed034",
                DB_HOST: 'phpdbserver.database.windows.net',
                DB_USER: 'phpadmin',
                DB_PASSWORD: 'phpp@ssw0rd',
                DB_NAME: 'phpdevdb',
            }
        }]
};
