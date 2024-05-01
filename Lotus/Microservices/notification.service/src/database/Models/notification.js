const { DataTypes} = require('sequelize');
const sequelize = require('../config.js');

const NOTIFICATION = sequelize.define('NOTIFICATIONS', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    AUTHOR: {
        type: DataTypes.STRING,
        allowNull: false
    },
    USER_ID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CONTENT: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    IMAGE: {
        type: DataTypes.STRING,
        defaultValue: 'default_profile.png'
    },
    PUBLISHED_AT: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { NOTIFICATION };
