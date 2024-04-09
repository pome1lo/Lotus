const { DataTypes } = require('sequelize');
const sequelize = require('../config.js');
const { USER } = require('./user');

const SUBSCRIPTION = sequelize.define('SUBSCRIPTION', {
    SUBSCRIBER_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'USER',
            key: 'ID'
        }
    },
    SUBSCRIBED_TO_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'USER',
            key: 'ID'
        }
    }
}, {
    timestamps: false,
    freezeTableName: true
});

USER.hasMany(SUBSCRIPTION, { as: 'SUBSCRIPTIONS', foreignKey: 'SUBSCRIBER_ID' });
USER.hasMany(SUBSCRIPTION, { as: 'SUBSCRIBERS', foreignKey: 'SUBSCRIBED_TO_ID' });


module.exports = { SUBSCRIPTION };
