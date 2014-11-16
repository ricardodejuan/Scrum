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

    // Socket.io NameSpace
    var nsp = io.of('/stories');
    nsp.on('connection', function (socket) {

        socket.on('story.room', function (room) {
            socket.join(room);
        });

        socket.on('story.created', function (data) {
            socket.broadcast.to(data.room).emit('on.story.created', data.story);
        });

        socket.on('story.deleted', function (data) {
            socket.broadcast.to(data.room).emit('on.story.deleted', data);
        });

        socket.on('story.updated', function (data) {
            socket.broadcast.to(data.room).emit('on.story.updated', data.story);
        });

        socket.on('story.moved', function (data) {
            socket.broadcast.to(data.room).emit('on.story.moved', data);
        });
    });

};