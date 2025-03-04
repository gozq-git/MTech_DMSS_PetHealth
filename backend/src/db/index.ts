import { Sequelize } from "sequelize";
import { readdirSync } from 'fs';
import { resolve } from 'path';

const sequelize = new Sequelize('phpdevdb', 'phpadmin', 'phpp@ssw0rd', {
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

// import models
(readdirSync(resolve(__dirname, './models'))).forEach(model => {
    console.log(model.split('.')[0]);
    const importedModel = require(`./models/${model}`)[model.split('.')[0]];
    sequelize.define(importedModel.name, importedModel.model, importedModel.options);
});
sequelize.sync ({alter: true});
export { sequelize, Sequelize };
