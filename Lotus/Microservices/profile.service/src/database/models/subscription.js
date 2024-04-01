const { DataTypes } = require('sequelize');
const sequelize = require('../config.js');
const { USER } = require('./user');

const SUBSCRIPTION = sequelize.define('SUBSCRIPTION', {
    subscriberId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    subscribedToId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'id'
        }
    }
}, {
    timestamps: false,
    freezeTableName: true
});

USER.hasMany(SUBSCRIPTION, { as: 'Subscriptions', foreignKey: 'subscriberId' });
USER.hasMany(SUBSCRIPTION, { as: 'Subscribers', foreignKey: 'subscribedToId' });


module.exports = { SUBSCRIPTION };
