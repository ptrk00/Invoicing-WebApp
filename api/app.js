require('dotenv').config({path: 'config/.env'});
const express = require('express');
const app = express();

const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');

const tokenAuth = require('./auth/tokenAuth');

const morgan = require('morgan');


app.use(morgan('dev'));

app.use(express.json());

app.use('/auth',authRouter);
app.use('/user',userRouter);

app.get('/'/*, tokenAuth*/,(req,res) => {
   res.send("Hello authenticated user!");
});

module.exports = app;