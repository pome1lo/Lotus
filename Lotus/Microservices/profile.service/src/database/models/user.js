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
    CountOfPosts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    SubscribersList: {
        type: DataTypes.TEXT,
        get: function() {
            return JSON.parse(this.getDataValue('SubscribersList'));
        },
        set: function(val) {
            return this.setDataValue('SubscribersList', JSON.stringify(val));
        }
    },
    SubscribersCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    SubscriptionsList: {
        type: DataTypes.TEXT,
        get: function() {
            return JSON.parse(this.getDataValue('SubscriptionsList'));
        },
        set: function(val) {
            return this.setDataValue('SubscriptionsList', JSON.stringify(val));
        }
    }
}, {
    timestamps: false,
    freezeTableName: true
});


module.exports = { USER };
