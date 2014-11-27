/**
 * Created by J. Ricardo de Juan Cajide on 10/19/14.
 */
'use strict';

var projectsApp = angular.module('projects');

projectsApp.controller('ProjectsController', ['$scope', 'Authentication', 'Projects', '$location',
    function($scope, Authentication, Projects, $location) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        // Find a list  of projects
        $scope.projects = Projects.query();

    }
]);

projectsApp.controller('ProjectsViewController', ['$scope', '$stateParams', 'Authentication', 'Projects', 'Sprints','$modal', '$log', '$http', '$location',
    function($scope, $stateParams, Authentication, Projects, Sprints, $modal, $log, $http, $location) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

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
        $scope.leave = function(selectedProject) {
            $http.put('/projects/' + selectedProject._id + '/leave').success(function(response) {
                // If successful project is removed of session
                $scope.project = null;

                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        // Open a modal window to view members
        $scope.modalViewMembers = function (size, selectedProject) {

            var members = $http.get('/projects/' + selectedProject._id + '/members');

            $modal.open({
                templateUrl: 'modules/projects/views/members-project.client.view.html',
                controller: function ($scope, $modalInstance, users) {

                    $scope.users = users;

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    users: function () {
                        return members.then(function (response) {
                            return response.data;
                        });
                    }
                }
            });
        };

        // Open a modal window to add members
        $scope.modalAddMembers = function (size, selectedProject) {

            $modal.open({
                templateUrl: 'modules/projects/views/add-members-project.client.view.html',
                controller: function ($scope, $modalInstance, project) {
                    $scope.project = project;

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
        };

        // Get sprints
        $scope.getSprints = function (project) {
            $scope.sprints = Sprints.query({ projectId: project._id });
        };

        $scope.sprintBurnDownChart = function (size, selectedProject) {

            var stories = $http.get('/projects/' + selectedProject._id + '/allStories');

            $modal.open({
                templateUrl: 'modules/projects/views/project-burndownchart.client.view.html',
                controller: ProjectBurnDownChartController,
                size: size,
                resolve: {
                    project: function () {
                        return selectedProject;
                    },
                    stories: function () {
                        return stories.then(function (response) {
                            return response.data;
                        });
                    }
                }
            });
        };

        var ProjectBurnDownChartController = function ($scope, $modalInstance, project, stories) {
            $scope.authentication = Authentication;

            // If user is not signed in then redirect back home
            if (!$scope.authentication.user) $location.path('/');

            $scope.stories = stories;

            $scope.ok = function () {
                $modalInstance.close(project);
            };

            var currentData = [],
                estimateData = [],
                currentStoryPoints = 0,
                totalStoryPoints = 0,
                today = new Date(),
                modified = false;

            function dayDiff(first, second) {
                return (second-first)/(1000*60*60*24);
            }

            var totalDays = dayDiff(new Date(project.startTime).getTime(), new Date(project.endTime).getTime()) + 1;
            var dayLabel = dayDiff(new Date(project.startTime).getTime(), new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) + 1;

            angular.forEach(stories, function (story) {
                if (!story.storyFinished)
                    currentStoryPoints += story.storyPoint;
                totalStoryPoints += story.storyPoint;
            });

            var d = (totalStoryPoints / (totalDays - 1) );
            for (var k = 0; k < totalDays; k++) {
                if (k === 0)
                    estimateData.push(totalStoryPoints);
                else if (k + 1 === totalDays)
                    estimateData.push(0);
                else
                    estimateData.push(Math.round((estimateData[k-1] - d) * 100) / 100);
            }

            for (var j = 0; j <= project.projectBurnDownChart.length; j++) {
                if (!project.projectBurnDownChart.length || project.projectBurnDownChart.length < dayLabel) {
                    project.projectBurnDownChart.push({ storyPoints: currentStoryPoints, day: dayLabel});
                    modified = true;
                } else if (j < project.projectBurnDownChart.length  && project.projectBurnDownChart[j].day === dayLabel) {
                    if (project.projectBurnDownChart[j].storyPoints !== currentStoryPoints) {
                        project.projectBurnDownChart[j].storyPoints = currentStoryPoints;
                        modified = true;
                    }
                }

                if (j < project.projectBurnDownChart.length)
                    currentData.push(project.projectBurnDownChart[j].storyPoints);
            }

            if (modified)
                project.$update({ projectId: project._id });

            $scope.chartConfig = {
                options: {
                    chart: {
                        type: 'line',
                        zoomType: 'x'
                    }
                },
                series: [{
                    data: currentData, name: 'Actual', color: '#FF0000'
                }, {
                    data: estimateData, name: 'Estimated', color: '#66CCFF'
                }],
                title: {
                    text: ''
                },
                xAxis: {currentMin: 0, currentMax: totalDays, minRange: 1, title: { text: 'Days' }},
                yAxis: {currentMin: 0, currentMax: totalStoryPoints, minRange: 2, title: { text: 'Story Points' }},
                loading: false,
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                }
            };

        };

    }
]);

projectsApp.controller('ProjectsAddMembersController', ['$scope', '$stateParams', 'Authentication', 'ProjectsNonMembers', '$timeout', '$log', '$http', '$location',
    function($scope, $stateParams, Authentication, ProjectsNonMembers, $timeout, $log, $http, $location) {
        $scope.authentication = Authentication;
        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        var timeout;
        $scope.$watch('username', function(newVal) {
            if (newVal) {
                if (timeout) $timeout.cancel(timeout);
                timeout = $timeout(
                    ProjectsNonMembers.nonMembers($stateParams.projectId, newVal)
                        .success(function (response) {
                            // the success function wraps the response in data
                            // so we need to call data.data to fetch the raw data
                            $scope.users = response;
                        }), 350);
            }
        });

        // Add member to project
        $scope.addMember = function(selectedProject, user) {
            $http.put('/projects/' + selectedProject._id + '/join', {'users': [user]}).success(function(response) {
                $scope.users = null;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);

projectsApp.controller('ProjectsCrUpController', ['$scope', 'Projects', 'Authentication', '$location',
    function($scope, Projects, Authentication, $location) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

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