'use strict';

var debug = require('debug')('pfc_scrum');
var init = require('./config/init')();
var config = require('./config/config');

// Database Connection
var db = require('./config/database')(config);

// Express settings
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
var server = app.listen(config.port, function() {
    debug('Scrum server listening on port ' + config.port);
});

var io = require('socket.io').listen(server);


io.sockets.on('connection', function(socket) {
    socket.emit('news', {
        hello: 'world'
    });
    socket.on('my other event', function(data) {
        console.log(data);
    });
});

module.exports = app;