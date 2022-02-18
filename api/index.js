// require('dotenv').config({path: 'config/.env'});

const app = require('./app');

// const express = require('express');
// const app = express();

const mongoose = require('mongoose');
const debug = require('debug')('server');

//console.log(process.env);

//const morgan = require('morgan');
const port = process.env.PORT;

// const userRouter = require('./routes/userRoute')
//
// const tokenAuth = require('./auth/tokenAuth');

// app.use(morgan('dev'));
//
// app.use(express.json());
//
// app.use('/users',userRouter);
//
// app.get('/'/*, tokenAuth*/,(req,res) => {
//    res.send("Hello authenticated user!");
// });
if(process.env.NODE_ENV !== "test") {
   (async () => {
          try {
             await mongoose.connect( /*process.env.NODE_ENV === "test" ?  process.env.MONGO_TEST_URL :*/  process.env.MONGO_URL);
             debug('Connected to db!');
          } catch (err) {
             debug(`Cannot connect to db! Error: ${err}`);
          }
       }
   )();
}

const server = app.listen(port);

module.exports = server;
