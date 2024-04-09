const { DataTypes } = require('sequelize');
const sequelize = require('../config.js');

const POST = sequelize.define('POSTS', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    USER_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'USERS',
            key: 'ID'
        }
    },
    TITLE: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CONTENT: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    IMAGE: {
        type: DataTypes.STRING,
        allowNull: true
    },
    PUBLISHED_AT: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { POST };
