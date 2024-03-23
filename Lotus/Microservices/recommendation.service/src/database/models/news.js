const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config.js');

const NEWS = sequelize.define('NEWS', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Heading: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Paragraph: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Date: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = NEWS;
