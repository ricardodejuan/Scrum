/**
 * Created by J. Ricardo de Juan Cajide on 10/16/14.
 */
'use strict';

// Setting up route
angular.module('projects').config(['$stateProvider',
    function($stateProvider) {
        // Articles state routing
        $stateProvider.
            state('listProjects', {
                url: '/projects',
                templateUrl: 'modules/projects/views/list-projects.client.view.html'
            }).
            state('createProject', {
                url: '/projects/create',
                templateUrl: 'modules/projects/views/create-project.client.view.html'
            }).
            state('viewProject', {
                url: '/projects/:projectId',
                templateUrl: 'modules/projects/views/view-project.client.view.html'
            });
    }
]);