/**
 * Created by J. Ricardo de Juan Cajide on 11/21/14.
 */
'use strict';


var tasksApp = angular.module('tasks');

tasksApp.controller('TasksController', ['$scope', '$stateParams', 'Authentication', '$location', 'Tasks', '$log',
    function ($scope, $stateParams, Authentication, $location, Tasks, $log) {
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

        $scope.isTask = true;

        $scope.createTask = function (story) {
            var t = new Tasks({
                taskName: this.taskName,
                taskDescription: this.taskDescription,
                taskPriority: this.taskPriority,
                taskPoints: this.taskPoints,
                taskRemark: this.taskRemark,
                taskRuleValidation: this.taskRuleValidation
            });
            t.$save({ storyId: story._id }, function (task) {
                $scope.tasks.push(task);

                $scope.taskName = '';
                $scope.taskDescription = '';
                $scope.taskPriority = {};
                $scope.taskPoints = 0;
                $scope.taskRemark = '';
                $scope.taskRuleValidation = '';
            });
        };

        $scope.deleteTask = function (task, story) {
            $scope.handleDeletedTask(task._id);
            task.$remove({ storyId: story._id,  taskId: task._id });
        };

        $scope.handleDeletedTask = function(id) {
            var oldTasks = $scope.tasks,
                newTasks = [];

            angular.forEach(oldTasks, function(task) {
                if(task._id !== id) newTasks.push(task);
            });

            $scope.tasks = newTasks;
        };

        $scope.viewTask = function (task) {
            $scope.isTask = false;
            $scope.selectedTask = task;
        };

        $scope.updateTask = function() {
            // $scope.selectedTask already updated!
            $scope.selectedTask.$update({ storyId: $scope.story._id, taskId: $scope.selectedTask._id });
        };

        $scope.checkTitle = function (data) {
            if (data.length >20) {
                return 'Max length is 20';
            }
        };
    }
]);

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
                taskPoints: this.taskPoints,
                taskRemark: this.taskRemark,
                taskRuleValidation: this.taskRuleValidation
            });

            t.$save({ storyId: story._id }, function (task) {
                SocketSprint.emit('task.created', {task: task, room: story.sprintId});

                $scope.taskName = '';
                $scope.taskDescription = '';
                $scope.taskPriority = {};
                $scope.taskPoints = 0;
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
        }
    }
]);