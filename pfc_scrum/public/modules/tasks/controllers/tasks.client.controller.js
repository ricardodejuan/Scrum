/**
 * Created by J. Ricardo de Juan Cajide on 11/21/14.
 */
'use strict';


var tasksApp = angular.module('tasks');


tasksApp.controller('TasksCreateUpdateController', ['$scope', '$stateParams', 'Authentication', '$location', 'Tasks', 'SocketSprint',
    function ($scope, $stateParams, Authentication, $location, Tasks, SocketSprint) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.priorities = [
            'VERY HIGH',
            'HIGH',
            'MEDIUM',
            'LOW',
            'VERY LOW'
        ];

        $scope.createTask = function (story) {
            var t = new Tasks({
                taskName: this.taskName,
                taskDescription: this.taskDescription,
                taskPriority: this.taskPriority,
                taskHours: this.taskHours,
                taskRemark: this.taskRemark,
                taskRuleValidation: this.taskRuleValidation
            });

            t.$save({ storyId: story._id }, function (task) {
                SocketSprint.emit('task.created', {task: task, room: story.sprintId});

                $scope.taskName = '';
                $scope.taskDescription = '';
                $scope.taskPriority = {};
                $scope.taskHours = '';
                $scope.taskRemark = '';
                $scope.taskRuleValidation = '';
            });
        };
        
        $scope.updateTask = function (updatedTask) {
            var task = updatedTask;

            task.$update({ storyId: task.storyId, taskId: task._id }, function(response) {
                SocketSprint.emit('task.updated', {task: response, room: $stateParams.sprintId});
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);