/**
 * Created by J. Ricardo de Juan Cajide on 11/16/14.
 */
'use strict';


var sprintsApp = angular.module('sprints');

sprintsApp.controller('SprintsCreateUpdateController', ['$scope', '$stateParams', 'Authentication', 'Sprints', '$http', '$location', 'SocketSprint',
    function ($scope, $stateParams, Authentication, Sprints, $http, $location, SocketSprint) {

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
                SocketSprint.emit('sprint.updated', {sprint: response, room: $stateParams.sprintId});
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);


sprintsApp.controller('SprintsViewController', ['$scope', '$stateParams', 'Authentication', 'Sprints', 'Phases', 'Tasks', 'Stories', '$http', '$location', '$modal', 'SocketSprint', '$log',
    function ($scope, $stateParams, Authentication, Sprints, Phases, Tasks, Stories, $http, $location, $modal, SocketSprint, $log) {

        $scope.authentication = Authentication;
        $scope.projectId = $stateParams.projectId;
        $scope.dailyScrum = false;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.tasks = [];
        $scope.stories = [];
        $scope.phases = Phases.query({ sprintId: $stateParams.sprintId });
        $scope.sprint =  Sprints.get({
            projectId: $stateParams.projectId,
            sprintId: $stateParams.sprintId
        });
        this.toggler = {};

        // Enter in a room
        SocketSprint.emit('sprint.room', $stateParams.sprintId);


        // Get Stories and Tasks
        $http.get('/projects/' + $stateParams.projectId + '/sprints/' + $stateParams.sprintId + '/backlog').then(function (result) {
            angular.forEach(result.data, function (s) {
                $scope.stories.push( new Stories(s) );
            });

            if ($scope.stories.length > 0){
                var tasks = [];

                angular.forEach($scope.stories, function (story) {

                    Tasks.query({ storyId: story._id }, function (result) {
                        angular.forEach(result, function (t) {
                            tasks.push(t);
                        });
                    });
                });

                $scope.tasks = tasks;
            }
        });

        $scope.createPhase = function () {
            var p = new Phases({
                phaseName: this.phaseName,
                position: $scope.phases.length
            });

            p.$save({ sprintId: $stateParams.sprintId }, function (phase) {
                $scope.phases.push(phase);
                SocketSprint.emit('phase.created', {phase: phase, room: $stateParams.sprintId});
            });
        };

        $scope.editPhase = function (phase) {
            phase.$update({ phaseId: phase._id } ,function (response) {
                SocketSprint.emit('phase.updated', {phase: response, room: $stateParams.sprintId});
            });
        };

        $scope.deletePhase = function (phase) {
            $scope.handleDeletedPhase(phase._id);
            SocketSprint.emit('phase.deleted', {id: phase._id, room: $stateParams.sprintId});
            phase.$remove({ sprintId: $stateParams.sprintId, phaseId: phase._id });
        };

        $scope.deleteTask = function (task) {
            $scope.handleDeletedTask(task._id);
            SocketSprint.emit('task.deleted', {id: task._id, room: $stateParams.sprintId});
            task.$remove({ taskId: task._id });
        };

        // Return US to PB
        $scope.movePB = function (story) {
            $scope.handleDeletedStory(story._id);
            SocketSprint.emit('story.returned', {id: story._id, room: $stateParams.sprintId});
            $scope.handleDeletedTaskByStory(story._id);
            SocketSprint.emit('task.returned', {id: story._id, room: $stateParams.sprintId});
            $http.put('/projects/' + $stateParams.projectId + '/stories/' + story._id + '/productBacklog');
        };

        // Move Tasks
        $scope.toggleState = function(event, ui, phase) {
            this.toggler.phaseId = phase._id;

            var length = $scope.phases.length - 1;
            if (phase._id === $scope.phases[length]._id)
                this.toggler.taskFinished = true;
            else this.toggler.taskFinished = false;

            var task = new Tasks(this.toggler);
            task.$update({ storyId: task.storyId, taskId: task._id });

            SocketSprint.emit('task.moved', {task: this.toggler, room: $stateParams.sprintId});

            $scope.handleMovedTask(this.toggler);
        };


        // Aux methods

        // Check if there are tasks in a phase
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


        // Handlers of Phases, Tasks, Stories

        //Tasks
        $scope.handleUpdatedTask = function (task) {
            var oldTasks = $scope.tasks,
                newTasks = [];

            angular.forEach(oldTasks, function(t) {
                if(t._id === task._id) newTasks.push(new Tasks(task));
                else newTasks.push(t);
            });

            $scope.tasks = newTasks;
        };

        $scope.handleMovedTask = function (task) {
            var ndx = $scope.tasks.map(function(t) {return t._id;}).indexOf(task._id);
            $scope.tasks.push(task);
            $scope.tasks.splice(ndx, 1);

            this.toggler = {};
        };

        $scope.handleDeletedTask = function(id) {
            var oldTasks = $scope.tasks,
                newTasks = [];

            angular.forEach(oldTasks, function(task) {
                if(task._id !== id) newTasks.push(task);
            });

            $scope.tasks = newTasks;
        };

        $scope.handleDeletedTaskByStory = function(id) {
            var oldTasks = $scope.tasks,
                newTasks = [];

            angular.forEach(oldTasks, function(task) {
                if(task.storyId !== id) newTasks.push(task);
            });

            $scope.tasks = newTasks;
        };

        //Phases
        $scope.handleUpdatedPhase = function (phase) {
            var oldPhases = $scope.phases,
                newPhases = [];

            angular.forEach(oldPhases, function(p) {
                if(p._id === phase._id) newPhases.push(new Phases(phase));
                else newPhases.push(p);
            });

            $scope.phases = newPhases;
        };
        
        $scope.handleDeletedPhase = function(id) {
            var oldPhases = $scope.phases,
                newPhases = [];

            angular.forEach(oldPhases, function(phase) {
                if(phase._id !== id) newPhases.push(phase);
            });

            $scope.phases = newPhases;
        };

        //Stories
        $scope.handleUpdatedStory = function(story) {
            var oldStories = $scope.stories,
                newStories = [];

            angular.forEach(oldStories, function(s) {
                if (s._id === story._id) newStories.push(new Stories(story));
                else newStories.push(s);
            });

            $scope.stories = newStories;
        };

        $scope.handleDeletedStory = function(id) {
            var oldStories = $scope.stories,
                newStories = [];

            angular.forEach(oldStories, function(story) {
                if(story._id !== id) newStories.push(story);
            });

            $scope.stories = newStories;
        };

        // Modals

        $scope.editStory = function (size, selectedStory) {

            $modal.open({
                templateUrl: 'modules/stories/views/edit-story.client.view.html',
                controller: function ($scope, $modalInstance, story) {
                    $scope.story = story;

                    $scope.ok = function () {
                        SocketSprint.emit('story.updated', {story: $scope.story, room: $stateParams.sprintId});
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
        };

        $scope.addTask = function (size, selectedStory) {
            $modal.open({
                templateUrl: 'modules/tasks/views/add-task.client.view.html',
                controller: function ($scope, $modalInstance, story) {

                    $scope.story = story;
                    
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

        $scope.editTask = function (size, selectedTask) {

            $modal.open({
                templateUrl: 'modules/tasks/views/edit-task.client.view.html',
                controller: function ($scope, $modalInstance, task) {
                    $scope.task = task;

                    $scope.ok = function () {
                        $modalInstance.close();
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
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
        
        $scope.editSprint = function (size, selectedSprint) {
            $modal.open({
                templateUrl: 'modules/sprints/views/edit-sprint.client.view.html',
                controller: function ($scope, $modalInstance, sprint) {
                    $scope.sprint = sprint;

                    $scope.ok = function () {
                        $modalInstance.close($scope.sprint);
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
        };

        $scope.sprintReview = function (size, selectedSprint, setStories) {
            $modal.open({
                templateUrl: 'modules/sprints/views/sprint-review.client.view.html',
                controller: function ($scope, $modalInstance, sprint, stories) {
                    $scope.sprint = sprint;

                    $scope.stories = stories;

                    $scope.ok = function () {
                        $modalInstance.close($scope.sprint);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    sprint: function () {
                        return selectedSprint;
                    },
                    stories: function () {
                        return setStories;
                    }
                }
            });
        };

        $scope.sprintRestrospective = function (size, selectedSprint) {
            $modal.open({
                templateUrl: 'modules/sprints/views/sprint-retrospective.client.view.html',
                controller: function ($scope, $modalInstance, sprint) {
                    $scope.sprint = sprint;

                    $scope.ok = function () {
                        $modalInstance.close($scope.sprint);
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
        };

        // Sockets


        //Phases
        SocketSprint.on('on.phase.created', function(phase) {
            $scope.phases.push( new Phases(phase) );
        });

        SocketSprint.on('on.phase.updated', function(phase) {
            $scope.handleUpdatedPhase(phase);
        });

        SocketSprint.on('on.phase.deleted', function(phase) {
            $scope.handleDeletedPhase(phase.id);
        });


        //Stories
        SocketSprint.on('on.story.updated', function(story) {
            $scope.handleUpdatedStory(story);
        });

        SocketSprint.on('on.story.returned', function(story) {
            $scope.handleDeletedStory(story.id);
        });


        //Tasks
        SocketSprint.on('on.task.created', function(task) {
            $scope.tasks.push( new Tasks(task));
        });

        SocketSprint.on('on.task.updated', function(task) {
            $scope.handleUpdatedTask(task);
        });

        SocketSprint.on('on.task.returned', function(data) {
            $scope.handleDeletedTaskByStory(data.id);
        });

        SocketSprint.on('on.task.moved', function(task) {
            $scope.handleMovedTask(task);
        });

        SocketSprint.on('on.task.deleted', function(task) {
            $scope.handleDeletedTask(task.id);
        });


        //Sprint
        SocketSprint.on('on.sprint.updated', function(sprint) {
            $scope.sprint = sprint;
        });

    }
]);