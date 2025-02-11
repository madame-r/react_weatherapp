const { createUser, findUserByEmail, verifyPassword, findUserById } = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Contrôleur pour l'inscription
const registerUser = async (req, res) => {

    const { email, password, name } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const user = await findUserByEmail(email);

        if (user) {
            return res.status(400).json({ message: 'Already existing user' });
        }

        // Créer l'utilisateur
        await createUser(email, password, name);
        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {

        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });

    }
};




// Contrôleur pour la connexion
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Générer un token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });


        res.cookie("token", token, {
            httpOnly: true, // Empêche l'accès via JavaScript
            secure: false,  // Mets "true" en production avec HTTPS
            sameSite: "lax", // Protection contre les attaques CSRF
        });

        console.log("Token envoyé au client :", token);


        return res.json({ message: 'Connection successful', token });
        
    } catch (error) {

        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error connecting' });
        
    }

};



    // Fonction pour obtenir les informations de l'utilisateur connecté
    const getUserProfile = async (req,res) => {

        try {
            // 🔥 L'utilisateur est déjà attaché à `req.user` grâce à `authenticateToken`
            res.json({
                id: req.user.id,
                email: req.user.email,
                name: req.user.name
            });
        } catch (error) {
            console.error('Error fetching user info:', error);
            res.status(500).json({ message: 'Error retrieving user info' });
        }


    };



module.exports = { registerUser, loginUser, getUserProfile };