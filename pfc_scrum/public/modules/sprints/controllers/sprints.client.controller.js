/**
 * Created by J. Ricardo de Juan Cajide on 11/16/14.
 */
'use strict';


var sprintsApp = angular.module('sprints');

sprintsApp.controller('SprintsCreateUpdateController', ['$scope', '$stateParams', 'Authentication', 'Sprints', '$http', '$location',
    function ($scope, $stateParams, Authentication, Sprints, $http, $location) {

        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.create = function() {
            var s = new Sprints({
                sprintName: this.sprintName,
                sprintDescription: this.sprintDescription,
                sprintStartTime: this.sprintStartTime,
                sprintEndTime: this.sprintEndTime
            });

            s.$save({ projectId: $stateParams.projectId }, function(sprint) {
                $location.path('projects/' + $stateParams.projectId + '/sprints/' + sprint._id);

                $scope.sprintName = '';
                $scope.sprintDescription = '';
                $scope.sprintStartTime = '';
                $scope.sprintEndTime = '';

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.today = function() {
            $scope.sprintStartTime = new Date();
        };

        $scope.clear = function () {
            $scope.sprintStartTime = null;
        };

        $scope.openStartDT = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedStartDT = true;
        };

        $scope.today = function() {
            $scope.sprintEndTime = new Date();
        };

        $scope.clear = function () {
            $scope.sprintEndTime = null;
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

        $scope.update = function(updatedSprint) {
            var sprint = updatedSprint;

            sprint.$update({ sprintId: updatedSprint._id }, function(response) {

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);


sprintsApp.controller('SprintsViewController', ['$scope', '$stateParams', 'Authentication', 'Sprints', 'Phases', 'Tasks', '$http', '$location', '$modal', '$log',
    function ($scope, $stateParams, Authentication, Sprints, Phases, Tasks, $http, $location, $modal, $log) {

        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.sprint =  Sprints.get({
            projectId: $stateParams.projectId,
            sprintId: $stateParams.sprintId
        });

        $scope.phases = Phases.query({ sprintId: $stateParams.sprintId });

        $scope.tasks = [];

        $http.get('/projects/' + $stateParams.projectId + '/sprints/' + $stateParams.sprintId + '/backlog').then(function (result) {
            $scope.stories = result.data;

            if ($scope.stories.length > 0){
                var tasks = [];

                angular.forEach($scope.stories, function (story) {
                    $http.get('/stories/' + story._id + '/tasks').then(function (result) {
                        angular.forEach(result.data, function (t) {
                            tasks.push(t);
                        });
                    });
                });

                $scope.tasks = tasks;
            }
        });

        $scope.createPhase = function (phaseName) {
            var p = new Phases({
                phaseName: phaseName,
                position: $scope.phases.length
            });

            p.$save({ sprintId: $stateParams.sprintId }, function (phase) {
                $scope.phases.push(phase);
            });
        };
        
        $scope.deletePhase = function (phase) {
            $scope.handleDeletedPhase(phase._id);
            phase.$remove({ sprintId: $stateParams.sprintId, phaseId: phase._id });
        };

        $scope.existTasks = function (phase) {
            if (phase.position === 0) return true;

            var exist = false;
            angular.forEach($scope.tasks, function (task) {
                if (task.phaseId === phase._id) {
                    exist = true;
                }
            });
            return exist;
        };

        $scope.handleDeletedPhase = function(id) {
            var oldPhases = $scope.phases,
                newPhases = [];

            angular.forEach(oldPhases, function(phase) {
                if(phase._id !== id) newPhases.push(phase);
            });

            $scope.phases = newPhases;
        };
        
        $scope.movePB = function (story) {
            $scope.handleDeletedStory(story._id);
            $scope.handleDeletedTask(story._id);
            $http.put('/projects/' + $stateParams.projectId + '/stories/' + story._id + '/productBacklog');
        };

        $scope.handleDeletedStory = function(id) {
            var oldStories = $scope.stories,
                newStories = [];

            angular.forEach(oldStories, function(story) {
                if(story._id !== id) newStories.push(story);
            });

            $scope.stories = newStories;
        };

        $scope.handleDeletedTask = function(id) {
            var oldTasks = $scope.tasks,
                newTasks = [];

            angular.forEach(oldTasks, function(task) {
                if(task.storyId !== id) newTasks.push(task);
            });

            $scope.tasks = newTasks;
        };

        $scope.viewStory = function (size, selectedStory) {

            $modal.open({
                templateUrl: 'modules/stories/views/view-story.client.view.html',
                controller: function ($scope, $modalInstance, story) {
                    $scope.story = story;

                    $scope.priorities = [
                        'MUST',
                        'SHOULD',
                        'COULD',
                        'WON\'T'
                    ];

                    $scope.ok = function () {
                        $modalInstance.close();
                    };
                },
                size: size,
                resolve: {
                    story: function () {
                        return selectedStory;
                    }
                }
            });
        };

        $scope.viewTask = function (size, selectedTask) {

            $modal.open({
                templateUrl: 'modules/tasks/views/view-task.client.view.html',
                controller: function ($scope, $modalInstance, task) {
                    $scope.task = task;

                    $scope.priorities = [
                        'VERY HIGH',
                        'HIGH',
                        'MEDIUM',
                        'LOW',
                        'VERY LOW'
                    ];

                    $scope.ok = function () {
                        $modalInstance.close();
                    };

                },
                size: size,
                resolve: {
                    task: function () {
                        return selectedTask;
                    }
                }
            });
        };

        this.toggler = {};

        $scope.toggleState = function(event, ui, phase) {
            this.toggler.phaseId = phase._id;

            var task = new Tasks(this.toggler);
            task.$update({ storyId: task.storyId, taskId: task._id });

            var ndx = $scope.tasks.map(function(t) {return t.taskName;}).indexOf(this.toggler.taskName);
            $scope.tasks.push(this.toggler);
            $scope.tasks.splice(ndx, 1);

            this.toggler = {};
        };
        
        $scope.editSprint = function (size, selectedSprint) {
            var modalInstance = $modal.open({
                templateUrl: 'modules/sprints/views/edit-sprint.client.view.html',
                controller: function ($scope, $modalInstance, sprint) {
                    $scope.sprint = sprint;

                    $scope.ok = function () {
                        //if (updateProjectForm.$valid) {
                        $modalInstance.close($scope.sprint);
                        //}
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    sprint: function () {
                        return selectedSprint;
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