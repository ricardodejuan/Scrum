/**
 * Created by J. Ricardo de Juan Cajide on 10/5/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users');
var stories = require('../../app/controllers/stories');


module.exports = function(app) {

    app.route('/projects/:projectId/stories')
        .get(users.requiresLogin, stories.hasAuthorization, stories.list)
        .post(users.requiresLogin, stories.hasAuthorization, stories.create);

    app.route('/projects/:projectId/stories/:storyId')
        .get(users.requiresLogin, stories.hasAuthorization, stories.load)
        .put(users.requiresLogin, stories.hasAuthorization, stories.update)
        .delete(users.requiresLogin, stories.hasAuthorization, stories.delete);

    // Finish by binding the user middleware*/
    //app.param('pId', stories.projectByID);
};
