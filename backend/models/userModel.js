require('dotenv').config();
const connection = require('../config/database');
const bcrypt = require('bcryptjs');





// Fonction pour créer un utilisateur
const createUser = (email, password) => {
    return new Promise((resolve, reject) => {
      // Hachage du mot de passe
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return reject(err);

              // Insérer l'utilisateur dans la base de données
      const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
      connection.query(sql, [email, hashedPassword], (err, results) => {
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
      connection.query(sql, [email], (err, results) => {
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