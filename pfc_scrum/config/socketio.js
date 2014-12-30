/**
 * Created by J. Ricardo de Juan Cajide on 9/13/14.
 */
'use strict';


var http = require('http');
var socketio = require('socket.io');

module.exports = function (app) {

    var io;
    var server;
    // Attach Socket.io
    if (process.env.NODE_ENV === 'secure') {
        io = socketio.listen(app);
    } else {
        server = http.createServer(app);
        io = socketio.listen(server);
        app.set('server', server);
    }


    // Socket.io NameSpace Stories
    var nspStories = io.of('/stories');
    nspStories.on('connection', function (socket) {

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

    // Socket.io NameSpace Sprints
    var nspSprints = io.of('/sprints');
    nspSprints.on('connection', function (socket) {

        socket.on('sprint.room', function (room) {
            socket.join(room);
        });


        //Sprint
        socket.on('sprint.updated', function (data) {
            socket.broadcast.to(data.room).emit('on.sprint.updated', data.sprint);
        });


        //Phases
        socket.on('phase.created', function (data) {
            socket.broadcast.to(data.room).emit('on.phase.created', data.phase);
        });

        socket.on('phase.updated', function (data) {
            socket.broadcast.to(data.room).emit('on.phase.updated', data.phase);
        });

        socket.on('phase.deleted', function (data) {
            socket.broadcast.to(data.room).emit('on.phase.deleted', data);
        });


        //Stories
        socket.on('story.updated', function (data) {
            socket.broadcast.to(data.room).emit('on.story.updated', data.story);
        });

        socket.on('story.returned', function (data) {
            socket.broadcast.to(data.room).emit('on.story.returned', data);
        });


        //Tasks
        socket.on('task.created', function (data) {
            nspSprints.to(data.room).emit('on.task.created', data.task);
        });

        socket.on('task.updated', function (data) {
            socket.broadcast.to(data.room).emit('on.task.updated', data.task);
        });

        socket.on('task.returned', function (data) {
            socket.broadcast.to(data.room).emit('on.task.returned', data);
        });

        socket.on('task.moved', function (data) {
            socket.broadcast.to(data.room).emit('on.task.moved', data.task);
        });

        socket.on('task.deleted', function (data) {
            socket.broadcast.to(data.room).emit('on.task.deleted', data);
        });
    });
};