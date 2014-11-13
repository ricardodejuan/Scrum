/**
 * Created by J. Ricardo de Juan Cajide on 9/13/14.
 */
'use strict';


var http = require('http');
var socketio = require('socket.io');

module.exports = function (app) {

    // Attach Socket.io
    var server = http.createServer(app);
    var io = socketio.listen(server);

    app.set('socketio', io);
    app.set('server', server);

    io.sockets.on('connection', function (socket) {
        socket.on('story.created', function (data) {
            socket.broadcast.emit('on.story.created', data);
        });

        socket.on('story.deleted', function (data) {
            socket.broadcast.emit('on.story.deleted', data);
        });

        socket.on('story.updated', function (data) {
            socket.broadcast.emit('on.story.updated', data);
        });
    });

};