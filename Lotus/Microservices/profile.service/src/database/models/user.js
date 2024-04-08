const { DataTypes } = require('sequelize');
const sequelize = require('../config.js');

const USER = sequelize.define('USERS', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    FirstName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    LastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    PhoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    BirthDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    SubscribersCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    SubscriptionsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    ProfilePicture: {
        type: DataTypes.STRING,
        defaultValue: '/static/media/default_profile.587c4b6422f165a03c3f.png'
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { USER };
