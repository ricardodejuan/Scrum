/**
 * Created by J. Ricardo de Juan Cajide on 10/19/14.
 */
'use strict';

//Projects service used for communicating with the projects REST endpoints
angular.module('projects').factory('Projects', ['$resource', '$http',
    function($resource) {
        return $resource('projects/:projectId', { projectId: '@_id' }, {
            update: {
                method: 'PUT'
            }
        });
    }
])
    .factory('ProjectsNonMembers', ['$http',
    function($http) {
        var nonMembersRequest = function (projectId, username) {
            return $http.get('/projects/' + projectId + '/nonmembers/' + username);
        };

        return {
            nonMembers: function (projectId, username) { return nonMembersRequest(projectId, username); }
        };
    }
]);