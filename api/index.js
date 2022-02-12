require('dotenv').config({path: 'config/.env'});

const express = require('express');
const app = express();

//console.log(process.env);

const morgan = require('morgan');

const port = process.env.PORT;

app.use(morgan('dev'));

app.get('/', (req,res) => {
   res.send("Hello");
});

const server = app.listen(port);

module.exports = server;
