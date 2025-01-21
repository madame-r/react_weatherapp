const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// Middleware pour la route d'inscription (pour loguer les requêtes)
router.post('/register', (req, res, next) => {
    console.log('Received registration request:', req.body); // Log de la requête
    next(); // Passe au contrôleur d'inscription
}, registerUser);

// Route de connexion
router.post('/login', loginUser);

module.exports = router;
