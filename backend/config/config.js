const path = require('path');
// This ensures the .env is loaded regardless of where you run the command from
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  development: {
    username: "root",
    password: process.env.DB_PASS || null,
    database: "freelance_db",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: console.log
  }
  // ... test and production as before
};