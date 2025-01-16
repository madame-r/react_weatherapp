
const { createUser, findUserByEmail, verifyPassword } = require('../models/userModel');
const jwt = require('jsonwebtoken');


// Contrôleur pour l'inscription
const registerUser = async (req, res) => {
    const { email, password, name } = req.body;


    try {

        // Vérifier si l'utilisateur existe déjà
        const user = await findUserByEmail(email);

        if (user) {
            return res.status(400).json({ message: 'Already existing user' })
        }


        // Créer l'utilisateur
        await createUser(email, password,name);
        res.status(201).json({ message: 'User created successfully' });


    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Error creating user' });

    }
}






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

        res.json({ message: 'Connection successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error connecting' });
    }
};


module.exports = { registerUser, loginUser };