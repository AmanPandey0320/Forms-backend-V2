const express = require('express')
const http = require('http');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const port = process.env.PORT;

app.get('/', (req, res) => res.send('Hello World!'))

server.listen(port, () => console.log(`Example app listening on port ${port}!`))