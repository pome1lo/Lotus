const { DataTypes } = require('sequelize');
const sequelize = require('../config.js');

const POST = sequelize.define('POSTS', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'USERS',
            key: 'id'
        }
    },
    Title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    PublishedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { POST };
