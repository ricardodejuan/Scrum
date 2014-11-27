/**
 * Created by J. Ricardo de Juan Cajide on 10/5/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller');
var stories = require('../../app/controllers/stories.server.controller');


module.exports = function(app) {

    app.route('/projects/:projectId/stories')
        .get(users.requiresLogin, stories.hasAuthorization, stories.list)
        .post(users.requiresLogin, stories.hasAuthorization, stories.create);

    app.route('/projects/:projectId/stories/:storyId')
        .get(users.requiresLogin, stories.hasAuthorization, stories.load)
        .put(users.requiresLogin, stories.hasAuthorization, stories.update)
        .delete(users.requiresLogin, stories.hasAuthorization, stories.delete);

    app.route('/projects/:projectId/allStories')
        .get(users.requiresLogin, stories.hasAuthorization, stories.allStories);

    app.route('/projects/:projectId/stories/:storyId/productBacklog')
        .put(users.requiresLogin, stories.hasAuthorization, stories.productBacklog);

    app.route('/projects/:projectId/storiesBacklog')
        .put(users.requiresLogin, stories.hasAuthorization, stories.backlog);

    // Finish by binding the user middleware*/
    //app.param('pId', stories.projectByID);
};
