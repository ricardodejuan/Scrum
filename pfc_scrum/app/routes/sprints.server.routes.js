/**
 * Created by J. Ricardo de Juan Cajide on 10/8/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller');
var sprints = require('../../app/controllers/sprints.server.controller');


module.exports = function(app) {

    app.route('/projects/:projectId/sprints')
        .get(users.requiresLogin, sprints.hasAuthorization, sprints.list)
        .post(users.requiresLogin, sprints.hasAuthorization, sprints.create);

    app.route('/projects/:projectId/sprints/:sprintId')
        .get(users.requiresLogin, sprints.hasAuthorization, sprints.load)
        .put(users.requiresLogin, sprints.hasAuthorization, sprints.update)
        .delete(users.requiresLogin, sprints.hasAuthorization, sprints.delete);

    app.route('/projects/:projectId/sprints/:sprintId/backlog')
        .get(users.requiresLogin, sprints.hasAuthorization, sprints.backlog);

    app.route('/projects/:projectId/sprintNotFinished')
        .get(users.requiresLogin, sprints.hasAuthorization, sprints.notFinished);

};
