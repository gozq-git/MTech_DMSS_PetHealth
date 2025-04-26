import { Sequelize } from "sequelize";
import { readdirSync } from 'fs';
import { resolve } from 'path';
import { config } from "../config/config";

const sequelize = new Sequelize(config.db_name, config.db_user, config.db_password, {
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

// import models
const associations: Array<any> = [];
(readdirSync(resolve(__dirname, './models'))).forEach(model => {
    console.log(model.split('.')[0]);
    const importedModel = require(`./models/${model}`)[model.split('.')[0]];
    sequelize.define(importedModel.name, importedModel.model, importedModel.options);
    if (importedModel.associate) {
        associations.push(importedModel.associate);
    }
});
associations.forEach(associate => associate(sequelize.models));
if (config.env === 'development') {
    sequelize.sync ({alter: true});
}
export { sequelize, Sequelize };
