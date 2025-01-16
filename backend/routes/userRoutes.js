
const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');


const router = express.Router();



// Route d'inscription
// router.post('/register', registerUser);

router.post('/register', (req, res, next) => {
    console.log('Received registration request:', req.body); // Log de la requête
    next(); // Passe au contrôleur
}, registerUser);



// Route de connexion
router.post('/login',loginUser);



module.exports = router;
