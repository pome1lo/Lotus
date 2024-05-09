const { DataTypes } = require('sequelize');
const sequelize = require('../config.js');
const { USER } = require('./user');

const SUPPORT = sequelize.define('SUPPORT', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    PROBLEM_MESSAGE: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    USER_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: USER,
            key: 'ID'
        }
    },
    DATE: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { SUPPORT };
