/**
 * Created by J. Ricardo de Juan Cajide on 11/25/14.
 */
'use strict';

//Dailies service used for communicating with the projects REST endpoints
angular.module('dailies').factory('Dailies', ['$resource',
    function($resource) {
        return $resource('sprints/:sprintId/dailies/:dailyId', { sprintId: '@sprintId', dailyId: '@dailyId' }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);