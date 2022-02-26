require('dotenv').config({path: 'config/.env'});
const express = require('express');
const app = express();
const cors = require('cors');

const authRouter = require('./src/routes/authRoute');
const clientRouter = require('./src/routes/clientRoute');
const invoiceRouter = require('./src/routes/invoiceRouote');
const invoiceGeneratorRouter = require('./src/routes/invoiceGeneratorRoute');
const mailSenderRouter = require('./src/routes/mailSenderRoute');
const paymentRouter = require('./src/routes/paymentRoute');


const morgan = require('morgan');


app.use(morgan('dev'));

app.use(express.json());
app.use(cors());

app.use('/auth',authRouter);
app.use('/client',clientRouter);
app.use('/client',invoiceRouter);
app.use('/generate', invoiceGeneratorRouter);
app.use('/send', mailSenderRouter);
app.use('/payment', paymentRouter);

app.get('/'/*, tokenAuth*/,(req,res) => {
   res.send("Hello authenticated user!");
});

module.exports = app;