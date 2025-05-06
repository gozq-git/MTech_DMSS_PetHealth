"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequelize = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "Sequelize", { enumerable: true, get: function () { return sequelize_1.Sequelize; } });
const fs_1 = require("fs");
const path_1 = require("path");
const config_1 = require("../config/config");
const sequelize = new sequelize_1.Sequelize(config_1.config.db_name, config_1.config.db_user, config_1.config.db_password, {
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
    },
    logging: false
});
exports.sequelize = sequelize;
// import models
const associations = [];
((0, fs_1.readdirSync)((0, path_1.resolve)(__dirname, './models'))).forEach(model => {
    console.log(model.split('.')[0]);
    const importedModel = require(`./models/${model}`)[model.split('.')[0]];
    sequelize.define(importedModel.name, importedModel.model, importedModel.options);
    if (importedModel.associate) {
        associations.push(importedModel.associate);
    }
});
associations.forEach(associate => associate(sequelize.models));
if (config_1.config.env === 'development') {
    sequelize.sync({ alter: true });
}
