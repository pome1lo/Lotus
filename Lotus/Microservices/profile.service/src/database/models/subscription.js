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

USER.belongsToMany(USER, {
    as: 'Subscriptions',
    through: SUBSCRIPTION,
    foreignKey: 'SUBSCRIBER_ID',
    otherKey: 'SUBSCRIBED_TO_ID'
});

USER.belongsToMany(USER, {
    as: 'Subscribers',
    through: SUBSCRIPTION,
    foreignKey: 'SUBSCRIBED_TO_ID',
    otherKey: 'SUBSCRIBER_ID'
});


module.exports = { SUBSCRIPTION };
