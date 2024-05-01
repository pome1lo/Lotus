const { DataTypes } = require('sequelize');
const sequelize = require('../config.js');
const {POST} = require("./post");
const {USER} = require("./user");

const COMMENT = sequelize.define('COMMENTS', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    USER_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: USER,
            key: 'ID'
        }
    },
    POST_ID: {
        type: DataTypes.INTEGER,
        references: {
            model: POST,
            key: 'ID'
        }
    },
    USERNAME: {
        type: DataTypes.STRING,
        allowNull: true
    },
    USER_PICTURE: {
        type: DataTypes.STRING,
        defaultValue: 'default_profile.png'
    },
    COMMENT: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    CREATED_AT: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { COMMENT };
