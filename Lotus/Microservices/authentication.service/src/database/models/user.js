const { DataTypes} = require('sequelize');
const sequelize = require('../config.js');

const USER = sequelize.define('USERS', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    USERNAME: {
        type: DataTypes.STRING,
        allowNull: false
    },
    EMAIL: {
        type: DataTypes.STRING,
        allowNull: false
    },
    PASSWORD: {
        type: DataTypes.STRING,
        allowNull: true
    },
    SALT: {
        type: DataTypes.STRING,
        allowNull: true
    },
    IS_EMAIL_VERIFIED: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    RESET_PASSWORD_TOKEN: {
        type: DataTypes.STRING,
        allowNull: true
    },
    RESET_PASSWORD_EXPIRES: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { USER };
