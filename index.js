const express = require('express')
const http = require('http');
require('dotenv').config();
const app = express();
const cors = require('cors')
const server = http.createServer(app);
const port = process.env.PORT;

app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 ,// For legacy browser support
    credentials:true
}

app.use(async function(req, res, next) {
    res.header('Access-Control-Allow-Origin','http://localhost:3000' );
    res.header('Access-Control-Allow-Credentials','true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
  });

app.use('/api',require('./api/router'));

server.listen(port, () => console.log(`Example app listening on port ${port}!`))