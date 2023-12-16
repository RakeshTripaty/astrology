const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());





mongoose.connect(process.env.MONGODB_URL, {
    //serverSelectionTimeoutMS: 5000,
  })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err));
  
app.use('/', userRoutes);

 

app.listen(3000, function () {
    console.log('Express app running on port ' + (3000))
});

