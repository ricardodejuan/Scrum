/**
 * Created by J. Ricardo de Juan Cajide on 11/9/14.
 */
'use strict';


var storiesApp = angular.module('stories');

storiesApp.directive('stickyNote', ['Socket', '$stateParams', function(Socket, $stateParams) {
    var linker = function(scope, element, attrs) {
        element.draggable({
            containment: '.containment-wrapper',
            stop: function(event, ui) {
                Socket.emit('story.moved', {
                    id: scope.story._id,
                    x: ui.position.left,
                    y: ui.position.top,
                    room: $stateParams.projectId
                });
                scope.story.storyPosX = ui.position.left;
                scope.story.storyPosY = ui.position.top;
                scope.story.$update({ storyId: scope.story._id });
            }
        });

        Socket.on('on.story.moved', function(story) {
            // Update if the same story
            if(story.id === scope.story._id) {
                element.animate({
                    left: story.x,
                    top: story.y
                });
            }
        });

        // Some DOM initiation to make it nice
        element.css('left', scope.story.storyPosX + 'px');
        element.css('top', scope.story.storyPosY + 'px');
        switch(scope.story.storyPriority) {
            case 'MUST': element.addClass('alert-danger'); break;
            case 'SHOULD': element.addClass('alert-warning'); break;
            case 'COULD': element.addClass('alert-info'); break;
            case 'WON\'T': element.addClass('alert-success'); break;
        }
        element.fadeIn();
    };

    var controller = function($scope) {
        // Incoming
        Socket.on('on.story.updated', function(story) {
            // Update if the same story
            if(story._id === $scope.story._id) {
                $scope.story.storyTitle = story.storyTitle;
                $scope.story.storyDescription = story.storyDescription;

            }
        });
    };

    return {
        restrict: 'A',
        link: linker,
        controller: controller,
        scope: {
            story: '='
        }
    };
}]);

storiesApp.controller('StoriesController', ['$scope', 'Socket', 'Stories', 'Authentication', '$location', '$stateParams', '$modal', '$http', 'Tasks',
    function($scope, Socket, Stories, Authentication, $location, $stateParams, $modal, $http, Tasks) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.stories = Stories.query({ projectId: $stateParams.projectId });

        // Enter in a room
        Socket.emit('story.room', $stateParams.projectId);

        // Incoming
        Socket.on('on.story.created', function(story) {
            $scope.stories.push( new Stories(story) );
        });

        Socket.on('on.story.deleted', function(story) {
            $scope.handleDeletedStory(story.id);
        });

        // Outgoing
        $scope.createStory = function() {
            var s = new Stories({
                storyTitle: 'New Story',
                storyDescription: 'Description',
                storyValue: 1,
                storyPoint: 1,
                storyPosX: 70,
                storyPosY: 120
            });

            s.$save({ projectId: $stateParams.projectId }, function (story) {
                $scope.stories.push(story);
                Socket.emit('story.created', {story: story, room: $stateParams.projectId});
            });
        };

        $scope.deleteStory = function(story) {
            $scope.handleDeletedStory(story._id);
            Socket.emit('story.deleted', {id: story._id, room: $stateParams.projectId});
            story.$remove({ projectId: $stateParams.projectId, storyId: story._id });
        };

        $scope.handleDeletedStory = function(id) {
            var oldStories = $scope.stories,
                newStories = [];

            angular.forEach(oldStories, function(story) {
                if(story._id !== id) newStories.push(story);
            });

            $scope.stories = newStories;
        };

        // Outgoing
        $scope.updateStory = function(story) {
            story.$update({ storyId: story._id });
            Socket.emit('story.updated', {story: story, room: $stateParams.projectId});
        };

        $scope.editStory = function (size, selectedStory) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/stories/views/edit-story.client.view.html',
                controller: function ($scope, $modalInstance, story) {
                    $scope.story = story;

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
        
        $scope.moveToSprint = function (size, selectedStory) {

            var sprints = $http.get('/projects/' + $stateParams.projectId + '/sprintNotFinished');
            var moveStory = function (id) {
                $scope.handleDeletedStory(id);
            };
            
            $modal.open({
                templateUrl: 'modules/stories/views/move-to-sprint.client.view.html',
                controller: function ($scope, $modalInstance, sprints, story) {
                    $scope.sprints = sprints;

                    $scope.move = function (sprint) {
                        $http.put('/projects/' + $stateParams.projectId + '/storiesBacklog', {'story': story, 'sprintId': sprint._id}).success(function(response) {
                            moveStory(story._id);
                            Socket.emit('story.deleted', {id: story._id, room: $stateParams.projectId});
                            $modalInstance.close(story);
                        });
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    sprints: function () {
                        return sprints.then(function (response) {
                            return response.data;
                        });
                    },
                    story: function () {
                        return selectedStory;
                    }
                }
            });
        };
        
        $scope.addTasks = function (size, selectedStory) {
            $modal.open({
                templateUrl: 'modules/tasks/views/tasks.client.view.html',
                controller: function ($scope, $modalInstance, story) {

                    $scope.story = story;

                    $scope.tasks = Tasks.query({ storyId: story._id });

                    $scope.move = function () {
                        $modalInstance.close(story);
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
    }
]);

storiesApp.controller('StoriesEditController', ['$scope', '$stateParams', 'Authentication', '$location', 'Socket',
    function ($scope, $stateParams, Authentication, $location, Socket) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.priorities = [
            'MUST',
            'SHOULD',
            'COULD',
            'WON\'T'
        ];

        $scope.update = function (updatedStory) {
            var story = updatedStory;
            story.$update({ storyId: story._id });
            Socket.emit('story.updated', {story: story, room: $stateParams.projectId});
        };
    }
]);