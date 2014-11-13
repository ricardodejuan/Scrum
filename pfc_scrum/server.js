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

// Socket.io settings
require('./config/socketio')(app);

// Start the app by listening on <port>
app.get('server').listen(config.port);


/*io.sockets.on('connection', function(socket) {
    socket.emit('news', {
        hello: 'world'
    });
    socket.on('my other event', function(data) {
        console.log(data);
    });
});*/

module.exports = app;