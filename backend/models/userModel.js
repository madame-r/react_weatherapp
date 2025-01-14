require('dotenv').config();

const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

// Configuration de la connexion MySQL
const connection = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Vérification de la connexion
connection.connect((err) => {
  if (err) {
    console.error("userModel : MySQL database connection error: ", err.stack);
    return;
  }
  console.log("userModel :Connected to MySQL database.");
});


// Fonction pour créer un utilisateur
const createUser = (email, password) => {
    return new Promise((resolve, reject) => {
      // Hachage du mot de passe
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return reject(err);

              // Insérer l'utilisateur dans la base de données
      const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
      db.query(sql, [email, hashedPassword], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  });
};


// Fonction pour trouver un utilisateur par email
const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      db.query(sql, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]); // Retourne l'utilisateur trouvé ou undefined
      });
    });
  };

  
  // Fonction pour vérifier le mot de passe
const verifyPassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  };
  
  module.exports = {
    createUser,
    findUserByEmail,
    verifyPassword,
  };