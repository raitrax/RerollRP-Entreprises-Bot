const Sequelize = require('sequelize');

require('dotenv').config();
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: '../database.sqlite',
});

const force = process.argv.includes('--force') || process.argv.includes('-f');

// require all models
const User_Roles = require('../models/user_roles.models')(sequelize, Sequelize.DataTypes);

// Init databse, does not drop if already existing
sequelize.sync({ force }).then(async () => {
  console.log('Database init');
  sequelize.close();
}).catch(console.error);
