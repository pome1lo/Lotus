const { DataTypes } = require('sequelize');
const sequelize = require('../config.js');

// sequelize.sync({ force: true })
//     .then(() => console.log('Database & tables created!'))
//     .catch(error => console.log('This error occurred', error));


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
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { USER };
