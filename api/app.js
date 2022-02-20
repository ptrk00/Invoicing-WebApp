require('dotenv').config({path: 'config/.env'});
const express = require('express');
const app = express();

const authRouter = require('./src/routes/authRoute');
const clientRouter = require('./src/routes/clientRoute');
const invoiceRouter = require('./src/routes/invoiceRouote');

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