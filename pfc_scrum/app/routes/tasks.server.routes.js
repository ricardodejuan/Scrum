/**
 * Created by J. Ricardo de Juan Cajide on 10/12/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller');
var tasks = require('../../app/controllers/tasks.server.controller');


module.exports = function(app) {

    app.route('/stories/:storyId/tasks')
        .get(users.requiresLogin, tasks.hasAuthorization, tasks.list)
        .post(users.requiresLogin, tasks.hasAuthorization, tasks.create);

    app.route('/stories/:storyId/tasks/:taskId')
        .get(users.requiresLogin, tasks.hasAuthorization, tasks.load)
        .put(users.requiresLogin, tasks.hasAuthorization, tasks.update)
        .delete(users.requiresLogin, tasks.hasAuthorization, tasks.delete);

};
