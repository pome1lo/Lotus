const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config.js');

const TOPICS = sequelize.define('TOPICS', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    TOPIC_NAME: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = TOPICS;
