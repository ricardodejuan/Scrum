/**
 * Created by J. Ricardo de Juan Cajide on 11/24/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller');
var dailies = require('../../app/controllers/dailies.scrum.server.controller');


module.exports = function(app) {

    app.route('/sprints/:sprintId/dailies')
        .get(users.requiresLogin, dailies.hasAuthorization, dailies.list)
        .post(users.requiresLogin, dailies.hasAuthorization, dailies.create);

    app.route('/sprints/:sprintId/dailies/:dailyId')
        .get(users.requiresLogin, dailies.hasAuthorization, dailies.load)
        .put(users.requiresLogin, dailies.hasAuthorization, dailies.update)
        .delete(users.requiresLogin, dailies.hasAuthorization, dailies.delete);

};
