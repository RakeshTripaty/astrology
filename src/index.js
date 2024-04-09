const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes');
const astrologerRoute= require('./routes/astrologer.routes')
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(bodyParser.json());

app.get('/help',(req,res)=>{
  res.send("hi")
}),

//app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
}));

mongoose.connect(process.env.MONGODB_URL, {
    //serverSelectionTimeoutMS: 5000,
  })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err));
  
app.use('/user', userRoutes);
app.use('/',astrologerRoute)


app.listen(3001, function () { 
    console.log('Express app running on port ' + (3001))
});


 
