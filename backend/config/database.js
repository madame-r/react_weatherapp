
require('dotenv').config();
const mysql2 = require("mysql2");

// Configuration de la connexion MySQL
const connection = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectTimeout: 20000, // à utiliser dans le cas d'une connexion ou d'un ordinateur lent
});

// Vérification de la connexion
connection.connect((err) => {
  if (err) {
    console.error("MySQL database connection error: ", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

module.exports = connection;
