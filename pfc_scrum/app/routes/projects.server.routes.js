/**
 * Created by J. Ricardo de Juan Cajide on 9/22/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller');
var projects = require('../../app/controllers/projects.server.controller');

module.exports = function(app) {

    app.route('/projects')
        .get(users.requiresLogin, projects.list)
        .post(users.requiresLogin, projects.create);

    app.route('/projects/:projectId')
        .get(users.requiresLogin, projects.hasAuthorization, projects.load)
        .put(users.requiresLogin, projects.hasAuthorization, projects.update);

    app.route('/projects/:projectId/join')
        .put(users.requiresLogin, projects.hasAuthorization, projects.join);

    app.route('/projects/:projectId/leave')
        .put(users.requiresLogin, projects.hasAuthorization, projects.leave);

    app.route('/projects/:projectId/members')
        .get(users.requiresLogin, projects.hasAuthorization, projects.members);

    app.route('/projects/:projectId/nonmembers/:username')
        .get(users.requiresLogin, projects.hasAuthorization, projects.nonmembers);

    // Finish by binding the user middleware
    app.param('projectId', projects.projectByID);
};
