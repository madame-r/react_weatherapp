require('dotenv').config();
const connection = require('../config/database');
const bcrypt = require('bcryptjs');





// Fonction pour créer un utilisateur
const createUser = (email, password, name) => {
    return new Promise((resolve, reject) => {
      // Hachage du mot de passe
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return reject(err);

              // Insérer l'utilisateur dans la base de données
      const sql = 'INSERT INTO users (email, password,name) VALUES (?, ?, ?)';
      connection.query(sql, [email, hashedPassword,name], (err, results) => {
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
  
  


// Fonction pour trouver un utilisateur par ID
const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    console.log("ID utilisateur extrait du token :", id);

    // Requête SQL pour récupérer l'utilisateur
    connection.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
      if (err) {
        console.error("Erreur dans la requête :", err);
        reject(err); // Rejette la promesse en cas d'erreur
      }

      console.log('Résultat de la requête:', rows);

      // Si un utilisateur est trouvé, on le retourne
      if (rows.length > 0) {
        console.log('Utilisateur trouvé:', rows[0]);
        resolve(rows[0]); // Résoudre la promesse avec l'utilisateur trouvé
      } else {
        console.log('Aucun utilisateur trouvé');
        resolve(null); // Résoudre la promesse avec null si aucun utilisateur trouvé
      }
    });
  });
};




  


  module.exports = {
    createUser,
    findUserByEmail,
    verifyPassword,
    findUserById
  };