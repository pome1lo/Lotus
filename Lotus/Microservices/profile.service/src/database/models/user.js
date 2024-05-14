const { DataTypes } = require('sequelize');
const sequelize = require('../config.js');
const {POST} = require("./post");

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
    DESCRIPTION: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    PROFILE_PICTURE: {
        type: DataTypes.STRING,
        defaultValue: 'default_profile.png'
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
}, {
    timestamps: false,
    freezeTableName: true
});

USER.hasMany(POST, { foreignKey: 'USER_ID' });
POST.belongsTo(USER, { foreignKey: 'USER_ID' });

module.exports = { USER };
