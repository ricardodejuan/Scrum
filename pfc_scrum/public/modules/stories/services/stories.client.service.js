/**
 * Created by J. Ricardo de Juan Cajide on 11/8/14.
 */
'use strict';

//Stories service used for communicating with the stories REST endpoints
angular.module('stories').factory('Stories', ['$resource',
    function($resource) {
        return $resource('projects/:projectId/stories/:storyId', { projectId: '@projectId', storyId: '@storyId' }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);