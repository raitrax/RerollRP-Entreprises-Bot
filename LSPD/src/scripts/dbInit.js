const Sequelize = require("sequelize");

require("dotenv").config();
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "../database.sqlite",
});

const force = process.argv.includes("--force") || process.argv.includes("-f");

// Init databse, does not drop if already existing
sequelize
  .sync({ force })
  .then(async () => {
    sequelize.close();
  })
  .catch(console.error);
