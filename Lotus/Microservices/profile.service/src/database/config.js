const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('PROFILE_SERVICE', 'sa', 'sa', {
    host: 'localhost',
    dialect: 'mssql',
    dialectOptions: {
        options: {
            trustServerCertificate: true,
        },
    },
});

module.exports = sequelize;
