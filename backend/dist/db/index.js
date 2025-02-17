"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequelize = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "Sequelize", { enumerable: true, get: function () { return sequelize_1.Sequelize; } });
const fs_1 = require("fs");
const path_1 = require("path");
const sequelize = new sequelize_1.Sequelize('phpdevdb', 'phpadmin', 'phpp@ssw0rd', {
    host: 'phpdbserver.database.windows.net',
    dialect: 'mssql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    },
    port: 1433,
    dialectOptions: {
        encrypt: true,
        acquireTimeout: 60000
    }
});
exports.sequelize = sequelize;
// import models
((0, fs_1.readdirSync)((0, path_1.resolve)(__dirname, './models'))).forEach(model => {
    console.log(model.split('.')[0]);
    const importedModel = require(`./models/${model}`)[model.split('.')[0]];
    sequelize.define(importedModel.name, importedModel.model, importedModel.options);
});
