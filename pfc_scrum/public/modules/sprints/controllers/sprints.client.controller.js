/**
 * Created by J. Ricardo de Juan Cajide on 11/16/14.
 */
'use strict';


var sprintsApp = angular.module('sprints');

sprintsApp.controller('SprintsCreateController', ['$scope', '$stateParams', 'Authentication', 'Sprints', '$http', '$location',
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
    }
]);


sprintsApp.controller('SprintsViewController', ['$scope', '$stateParams', 'Authentication', 'Sprints', 'Phases', 'Tasks', '$http', '$location', '$modal',
    function ($scope, $stateParams, Authentication, Sprints, Phases, Tasks, $http, $location, $modal) {

        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.sprint =  Sprints.get({
            projectId: $stateParams.projectId,
            sprintId: $stateParams.sprintId
        });

        $http.get('/projects/' + $stateParams.projectId + '/sprints/' + $stateParams.sprintId + '/backlog').then(function (result) {
            $scope.stories = result.data;
        });

        $scope.phases = Phases.query({ sprintId: $stateParams.sprintId });

        $scope.createPhase = function (phaseName) {
            var p = new Phases({
                phaseName: phaseName,
                position: $scope.phases.length + 1
            });

            p.$save({ sprintId: $stateParams.sprintId }, function (phase) {
                $scope.phases.push(phase);
            });
        };
        
        $scope.deletePhase = function (phase) {
            $scope.handleDeletedPhase(phase._id);
            phase.$remove({ sprintId: $stateParams.sprintId, phaseId: phase._id });
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

        $scope.viewStory = function (size, selectedStory) {

            var modalInstance = $modal.open({
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
                        $modalInstance.close($scope.story);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    story: function () {
                        return selectedStory;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            });
        };
    }
]);