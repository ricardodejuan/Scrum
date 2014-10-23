/**
 * Created by J. Ricardo de Juan Cajide on 10/19/14.
 */
'use strict';

var projectsApp = angular.module('projects');

projectsApp.controller('ProjectsController', ['$scope', '$stateParams', 'Authentication', 'Projects',
    function($scope, $stateParams, Authentication, Projects) {

        this.authentication = Authentication;

        // Find a list  of projects
        this.projects = Projects.query();

    }
]);

projectsApp.controller('ProjectsViewController', ['$scope', '$stateParams', 'Authentication', 'Projects', '$modal', '$log',
    function($scope, $stateParams, Authentication, Projects, $modal, $log) {

        this.authentication = Authentication;

        this.project =  Projects.get({
                projectId: $stateParams.projectId
            });

        // Open a modal window
        this.modal = function (size, selectedProject) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/projects/views/edit-project.client.view.html',
                controller: function ($scope, $modalInstance, project) {
                    $scope.project = project;

                    $scope.ok = function () {
                        $modalInstance.close($scope.project);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    project: function () {
                        return selectedProject;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }
]);

projectsApp.controller('ProjectsCreateController', ['$scope', 'Projects', 'Authentication',
    function($scope, Projects, Authentication) {
        $scope.authentication = Authentication;

        $scope.create = function() {
            var project = new Projects({
                projectName: this.projectName,
                descriptionName: this.descriptionName,
                startTime: this.startTime,
                endTime: this.endTime
            });
            project.$save(function(response) {
                $location.path('projects/' + response._id);

                $scope.projectName = '';
                $scope.descriptionName = '';
                $scope.startTime = '';
                $scope.endTime = '';

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);

projectsApp.controller('ProjectsUpdateController', ['$scope', 'Projects',
    function($scope, Projects) {

        this.update = function(updatedProject) {
            var project = updatedProject;

            project.$update(function() {

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);


/*
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects',
    function($scope, $stateParams, $location, Authentication, Projects) {
        $scope.authentication = Authentication;

        $scope.create = function() {
            var project = new Projects({
                projectName: this.projectName,
                descriptionName: this.descriptionName,
                startTime: this.startTime,
                endTime: this.endTime
            });
            project.$save(function(response) {
                $location.path('projects/' + response._id);

                $scope.projectName = '';
                $scope.descriptionName = '';
                $scope.startTime = '';
                $scope.endTime = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.update = function() {
            var project = $scope.project;

            project.$update(function() {
                $location.path('project/' + project._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function() {
            $scope.projects = Projects.query();
        };

        $scope.findOne = function() {
            $scope.project = Projects.get({
                projectId: $stateParams.projectId
            });
        };
    }
]);*/