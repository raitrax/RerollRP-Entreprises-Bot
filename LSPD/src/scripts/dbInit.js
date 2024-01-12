const Sequelize = require('sequelize');

require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || 3306,
	dialect: 'mysql',
	logging: false,
});

const force = process.argv.includes('--force') || process.argv.includes('-f');

// require all models

// Init databse, does not drop if already existing
sequelize.sync({ force }).then(async () => {
	console.log('Database init');
	sequelize.close();
}).catch(console.error);
