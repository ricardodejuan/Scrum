/**
 * Created by J. Ricardo de Juan Cajide on 11/18/14.
 */
'use strict';

//Phases service used for communicating with the projects REST endpoints
angular.module('tasks').factory('Tasks', ['$resource',
    function($resource) {
        return $resource('stories/:storyId/tasks/:taskId', { storyId: '@storyId', taskId: '@taskId' }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);