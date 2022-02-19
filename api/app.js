require('dotenv').config({path: 'config/.env'});
const express = require('express');
const app = express();

const authRouter = require('./routes/authRoute');
const clientRouter = require('./routes/clientRoute');
const invoiceRouter = require('./routes/invoiceRouote');

const morgan = require('morgan');


app.use(morgan('dev'));

app.use(express.json());

app.use('/auth',authRouter);
app.use('/client',clientRouter);
app.use('/client',invoiceRouter);

app.get('/'/*, tokenAuth*/,(req,res) => {
   res.send("Hello authenticated user!");
});

module.exports = app;