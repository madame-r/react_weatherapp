const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { findUserById } = require('../models/userModel');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware pour vérifier le token JWT et récupérer l'utilisateur
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Utilisation du token dans les cookies
    console.log("Token reçu dans authenticateToken :", token);

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing' });
    }

    // Vérification du token JWT
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.error("Erreur de vérification JWT :", err);
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        console.log("Decoded token:", decoded); // Affichage de ce qui est décodé

        try {
            // Utilisation de `userId` extrait du token pour trouver l'utilisateur
            const user = await findUserById(decoded.userId);
            console.log("Utilisateur trouvé:", user); // Vérification que l'utilisateur existe

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Si l'utilisateur est trouvé, on le passe dans la requête
            req.user = user;
            next(); // On passe à la route suivante
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
};

// Route pour récupérer les informations de l'utilisateur connecté
router.get('/me', authenticateToken, getUserProfile);

// Middleware pour la route d'inscription (loguer les requêtes)
router.post('/register', (req, res, next) => {
    console.log('Received registration request:', req.body); // Log de la requête
    next(); // Passe au contrôleur d'inscription
}, registerUser);

// Route de connexion
router.post('/login', loginUser);

module.exports = router;
