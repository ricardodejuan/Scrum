/**
 * Created by J. Ricardo de Juan Cajide on 10/19/14.
 */
'use strict';

var projectsApp = angular.module('projects');

projectsApp.controller('ProjectsController', ['$scope', 'Authentication', 'Projects',
    function($scope, Authentication, Projects) {
        $scope.authentication = Authentication;

        // Find a list  of projects
        $scope.projects = Projects.query();

    }
]);

projectsApp.controller('ProjectsViewController', ['$scope', '$stateParams', 'Authentication', 'Projects', '$modal', '$log', '$http', '$location',
    function($scope, $stateParams, Authentication, Projects, $modal, $log, $http, $location) {
        $scope.authentication = Authentication;

        // Get a project
        $scope.project =  Projects.get({
                projectId: $stateParams.projectId
            });

        // Open a modal window
        $scope.modal = function (size, selectedProject) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/projects/views/edit-project.client.view.html',
                controller: function ($scope, $modalInstance, project) {
                    $scope.project = project;

                    $scope.ok = function () {
                        //if (updateProjectForm.$valid) {
                            $modalInstance.close($scope.project);
                        //}
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

        // Leave project
        $scope.leave = function() {
            $http.put('/projects/' + $stateParams.projectId + '/leave').success(function(response) {
                // If successful we assign the response to the global user model
                $scope.project = null;

                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);

projectsApp.controller('ProjectsCrUpController', ['$scope', 'Projects', 'Authentication', '$location',
    function($scope, Projects, Authentication, $location) {
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

        $scope.today = function() {
            $scope.startTime = new Date();
        };

        $scope.clear = function () {
            $scope.startTime = null;
        };

        $scope.openStartDT = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedStartDT = true;
        };

        $scope.today = function() {
            $scope.endTime = new Date();
        };

        $scope.clear = function () {
            $scope.endTime = null;
        };

        $scope.openEndDT = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedEndDT = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.update = function(updatedProject) {
            var project = updatedProject;

            project.$update(function(response) {

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

    }
]);