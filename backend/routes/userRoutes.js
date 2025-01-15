
const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');


const router = express.Router();



// Route d'inscription
router.post('/register', registerUser);



// Route de connexion
router.post('/login',loginUser);



module.exports = router;
