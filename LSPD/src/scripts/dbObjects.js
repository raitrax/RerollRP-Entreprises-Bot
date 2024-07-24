const Sequelize = require('sequelize');

require('dotenv').config();

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: '../database.sqlite',
});

// require all models
const User_Roles = require('../models/user_roles.models')(sequelize, Sequelize.DataTypes);

module.exports = {
  User_Roles,
};
