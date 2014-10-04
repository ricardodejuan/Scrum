/**
 * Created by J. Ricardo de Juan Cajide on 9/22/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users');
var projects = require('../../app/controllers/projects');

module.exports = function(app) {

    app.route('/projects')
        .get(users.requiresLogin, projects.list)
        .post(users.requiresLogin, projects.create);

    app.route('/projects/:projectId')
        .get(users.requiresLogin, projects.hasAuthorization, projects.get)
        .put(users.requiresLogin, projects.hasAuthorization, projects.update);

    app.route('/projects/:projectId/join')
        .put(users.requiresLogin, projects.hasAuthorization, projects.join);

    app.route('/projects/:projectId/leave')
        .put(users.requiresLogin, projects.hasAuthorization, projects.leave);

    // Finish by binding the user middleware
    app.param('projectId', projects.projectByID);
};
