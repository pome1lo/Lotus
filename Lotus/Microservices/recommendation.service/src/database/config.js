const { Sequelize } = require('sequelize');

const db_host = process.env.DB_HOST == null ? "localhost" : process.env.DB_HOST;
const db_port = process.env.DB_PORT == null ? 1433 : process.env.DB_PORT;
const db_name = process.env.DB_NAME == null ? "RECOMMENDATION_SERVICE" : process.env.DB_NAME;
const db_pass = process.env.DB_PASSWORD == null ? "sa" : process.env.DB_PASSWORD;

const sequelize = new Sequelize(db_name, 'sa', db_pass, {
    host: db_host,
    dialect: 'mssql',
    port: db_port,
    dialectOptions: {
        options: {
            trustServerCertificate: true,
        },
    },
});

module.exports = sequelize;
