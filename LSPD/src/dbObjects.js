const Sequelize = require('sequelize');

require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || 3306,
	dialect: 'mysql',
	logging: false,
});

// require all models
const StatusMsg = require('./models/statusmsg.models')(sequelize, Sequelize.DataTypes);
const User = require('./models/user.models')(sequelize, Sequelize.DataTypes);

module.exports = {
	StatusMsg,
	User,
};
