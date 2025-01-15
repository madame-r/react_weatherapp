

const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const axios = require('axios');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 4000;


const connection = require('./config/database');


const weatherRoutes = require('./routes/weatherRoutes'); 
const autocompleteRoutes = require('./routes/autocompleteRoutes'); 
const userRoutes = require('./routes/userRoutes'); 



const { saveDataToFile, saveDataToDatabase } = require('./utils/fileUtils');
const { calculateLocalTime } = require('./utils/timeUtils');





app.use('/weather', weatherRoutes);
app.use('/autocomplete', autocompleteRoutes);
app.use('/users', userRoutes); 



// Lancer le serveur
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
