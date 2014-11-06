/**
 * Created by J. Ricardo de Juan Cajide on 10/19/14.
 */
'use strict';

//Projects service used for communicating with the projects REST endpoints
angular.module('projects').factory('Projects', ['$resource',
    function($resource) {
        return $resource('projects/:projectId', { projectId: '@_id' }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);