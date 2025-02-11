
require('dotenv').config();

const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


const app = express();


app.use(cors({
  origin: "http://localhost:3000", // URL Frontend
  credentials: true, // Permet d'envoyer les cookies
}));


app.use(bodyParser.json());
app.use(cookieParser());


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true"); // ✅ Autorise les cookies cross-origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});



const port = 4000;


const connection = require('./config/database');


const weatherRoutes = require('./routes/weatherRoutes'); 
const autocompleteRoutes = require('./routes/autocompleteRoutes'); 
const userRoutes = require('./routes/userRoutes'); 



const { saveDataToDatabase } = require('./utils/fileUtils');
const { calculateLocalTime } = require('./utils/timeUtils');





app.use('/weather', weatherRoutes);
app.use('/autocomplete', autocompleteRoutes);
app.use('/users', userRoutes); 



// Lancer le serveur
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
