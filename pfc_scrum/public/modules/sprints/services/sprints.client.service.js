/**
 * Created by J. Ricardo de Juan Cajide on 11/16/14.
 */
'use strict';

//Sprints service used for communicating with the stories REST endpoints
angular.module('sprints').factory('Sprints', ['$resource',
    function($resource) {
        return $resource('projects/:projectId/sprints/:sprintId', { projectId: '@projectId', sprintId: '@sprintId' }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);