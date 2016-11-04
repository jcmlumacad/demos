'use strict';

var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    port = 3000;

require('./modules/socket/server')(io);

app.use('/modules', express.static(__dirname + '/modules'));
app.use('/', express.static(__dirname + '/node_modules'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(port, function() {
    console.log('Connecting to localhost:3000');
});