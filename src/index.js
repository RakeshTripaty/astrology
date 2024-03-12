const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes');
const astrologerRoute= require('./routes/astrologer.routes')
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
app.use('/',astrologerRoute)


app.listen(3001, function () { 
    console.log('Express app running on port ' + (3001))
});