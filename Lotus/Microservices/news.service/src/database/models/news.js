const { DataTypes } = require('sequelize');
const sequelize = require('../config.js');

const NEWS = sequelize.define('NEWS', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    TITLE: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    PARAGRAPH: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ALT: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    LINK: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    IMAGE: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    DATE: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    TOPIC_NAME: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = {NEWS};
