const { DataTypes } = require('sequelize');
const sequelize = require('../config.js');

const USER = sequelize.define('USERS', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    USERNAME: {
        type: DataTypes.STRING,
        allowNull: true
    },
    EMAIL: {
        type: DataTypes.STRING,
        allowNull: true
    },
    FIRSTNAME: {
        type: DataTypes.STRING,
        allowNull: true
    },
    LASTNAME: {
        type: DataTypes.STRING,
        allowNull: true
    },
    PHONE_NUMBER: {
        type: DataTypes.STRING,
        allowNull: true
    },
    SUBSCRIBERS_COUNT: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    SUBSCRIPTIONS_COUNT: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    POSTS_COUNT: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    PROFILE_PICTURE: {
        type: DataTypes.STRING,
        defaultValue: 'default_profile.png'
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { USER };
