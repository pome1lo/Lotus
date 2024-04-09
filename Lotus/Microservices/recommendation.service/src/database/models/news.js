const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config.js');

const NEWS = sequelize.define('NEWS', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    HEADING: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    PARAGRAPH: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    DATE: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    TOPIC_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'TOPICS',
            key: 'ID'
        }
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = NEWS;
