/**
 * Created by J. Ricardo de Juan Cajide on 10/8/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller');
var phases = require('../../app/controllers/phases.server.controller');


module.exports = function(app) {

    app.route('/sprints/:sprintId/phases')
        .get(users.requiresLogin, phases.hasAuthorization, phases.list)
        .post(users.requiresLogin, phases.hasAuthorization, phases.create);

    app.route('/sprints/:sprintId/phases/:phaseId')
        .get(users.requiresLogin, phases.hasAuthorization, phases.load)
        .put(users.requiresLogin, phases.hasAuthorization, phases.update)
        .delete(users.requiresLogin, phases.hasAuthorization, phases.delete);

};
