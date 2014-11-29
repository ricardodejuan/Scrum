/**
 * Created by J. Ricardo de Juan Cajide on 11/9/14.
 */
'use strict';


var storiesApp = angular.module('stories');

storiesApp.directive('stickyNote', ['SocketPB', '$stateParams', function(SocketPB, $stateParams) {
    var linker = function(scope, element, attrs) {
        element.draggable({
            containment: '.containment-wrapper',
            stop: function(event, ui) {
                SocketPB.emit('story.moved', {
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

        SocketPB.on('on.story.moved', function(story) {
            // Update if the same story
            if(story.id === scope.story._id) {
                element.animate({
                    left: story.x,
                    top: story.y
                });
            }
        });

        function priotiy(element, story) {
            switch(story.storyPriority) {
                case 'MUST': element.addClass('alert-danger'); break;
                case 'SHOULD': element.addClass('alert-warning'); break;
                case 'COULD': element.addClass('alert-info'); break;
                case 'WON\'T': element.addClass('alert-success'); break;
            }
        }

        // Some DOM initiation to make it nice
        element.css('left', scope.story.storyPosX + 'px');
        element.css('top', scope.story.storyPosY + 'px');
        priotiy(element, scope.story);
        element.fadeIn();
    };

    var controller = function($scope) {
        // Incoming
        SocketPB.on('on.story.updated', function(story) {
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

storiesApp.controller('StoriesController', ['$scope', 'SocketPB', 'Stories', 'Authentication', '$location', '$stateParams', '$modal', '$http', 'Tasks',
    function($scope, SocketPB, Stories, Authentication, $location, $stateParams, $modal, $http, Tasks) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.stories = Stories.query({ projectId: $stateParams.projectId });

        // Enter in a room
        SocketPB.emit('story.room', $stateParams.projectId);

        // Incoming
        SocketPB.on('on.story.created', function(story) {
            $scope.stories.push( new Stories(story) );
        });

        SocketPB.on('on.story.updated', function(story) {
            $scope.handleUpdatedStory(story);
        });

        SocketPB.on('on.story.deleted', function(story) {
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
                SocketPB.emit('story.created', {story: story, room: $stateParams.projectId});
            });
        };

        $scope.deleteStory = function(story) {
            $scope.handleDeletedStory(story._id);
            SocketPB.emit('story.deleted', {id: story._id, room: $stateParams.projectId});
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

        $scope.handleUpdatedStory = function(story) {
            var oldStories = $scope.stories,
                newStories = [];

            angular.forEach(oldStories, function(s) {
                if (s._id === story._id) newStories.push(new Stories(story));
                else newStories.push(s);
            });

            $scope.stories = newStories;
        };

        // Outgoing
        $scope.updateStory = function(story) {
            story.$update({ storyId: story._id });
            SocketPB.emit('story.updated', {story: story, room: $stateParams.projectId});
        };

        $scope.editStory = function (size, selectedStory) {

            function updateStoryList(story) {
                $scope.handleUpdatedStory(story);
            }

            $modal.open({
                templateUrl: 'modules/stories/views/edit-story.client.view.html',
                controller: function ($scope, $modalInstance, story) {
                    $scope.story = story;

                    $scope.ok = function () {
                        SocketPB.emit('story.updated', {story: $scope.story, room: $stateParams.projectId});
                        updateStoryList($scope.story);
                        $modalInstance.close();
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
                            SocketPB.emit('story.deleted', {id: story._id, room: $stateParams.projectId});
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
    }
]);

storiesApp.controller('StoriesEditController', ['$scope', '$stateParams', 'Authentication', '$location', '$http', '$log',
    function ($scope, $stateParams, Authentication, $location, $http, $log) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.priorities = [
            'MUST',
            'SHOULD',
            'COULD',
            'WON\'T'
        ];

        $http.get('/projects/' + $stateParams.projectId + '/members').then(function (response) {
            $scope.members = response.data;
        });

        $scope.showMembers = function (story) {
            var selected = [];
            angular.forEach($scope.members, function (m) {
                if (story.users.indexOf(m._id) >= 0) {
                    selected.push(m.username);
                }
            });
            return selected.length ? selected.join(', ') : 'No user assigned';
        };

        $scope.update = function (updatedStory) {
            var story = updatedStory;
            story.$update({ storyId: story._id });
        };

    }
]);