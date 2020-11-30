const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');

const port = 3000;
const app = new express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const ws = require('./backend/ws');
io.on('connect', ws.connection);

const eod = require('./backend/eod');
eod.init();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

const router = require('./backend/router');
app.use('/api', router);

app.use(express.static('frontend/public'));
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'public', 'index.html')));

mongoose.connect('mongodb://localhost:27017/stockdb', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    http.listen(port, () => console.log(`App listening on port ${port}`));
});
