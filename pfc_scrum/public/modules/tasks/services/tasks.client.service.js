/**
 * Created by J. Ricardo de Juan Cajide on 11/18/14.
 */
'use strict';

//Phases service used for communicating with the projects REST endpoints
angular.module('tasks').factory('Tasks', ['$resource',
    function($resource) {
        return $resource('sprints/:sprintId/phases/:phaseId', { sprintId: '@sprintId', phaseId: '@phaseId' }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);