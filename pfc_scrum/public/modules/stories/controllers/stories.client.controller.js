/**
 * Created by J. Ricardo de Juan Cajide on 11/9/14.
 */
'use strict';
/*
var storiesApp = angular.module('stories');

storiesApp.controller('StoriesController', ['$scope', 'Authentication', 'Stories', '$location', 'Socket', '$log', '$stateParams', '$modal',
    function($scope, Authentication, Stories, $location, Socket, $log, $stateParams, $modal) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        // Find stories list
        $scope.stories = Stories.query({ projectId: $stateParams.projectId });

        // Incoming
        Socket.on('on.story.created', function(story) {
            $scope.stories.push( new Stories(story) );
        });

        Socket.on('on.story.deleted', function(id) {
            $scope.handleDeletedNoted(id);
        });

        // Outgoing
        $scope.createNote = function() {
            var note = new Stories({
                storyTitle: 'New Story',
                storyDescription: 'Description',
                storyValue: 1,
                storyPoint: 1,
                storyPosX: 70,
                storyPosY: 120
            });

            note.$save({ projectId: $stateParams.projectId }, function (story) {
                $scope.stories.push(story);
                Socket.emit('story.created', story);
            });
        };

        $scope.deleteNote = function(story) {
            $scope.handleDeletedNoted(story._id);
            Socket.emit('story.deleted', story._id);
            story.$remove({ projectId: $stateParams.projectId, storyId: story._id });
        };

        $scope.handleDeletedNoted = function(id) {
            var oldStories = $scope.stories;
            var newStories = [];
            angular.forEach(oldStories, function (story) {
                if (story._id !== id) newStories.push(story);
            });
            $scope.stories = newStories;
        };

        $scope.updateNote = function(note) {
            note.$update({ storyId: note._id });
            Socket.emit('story.updated', note);
        };

        $scope.editStory = function (size, selectedStory) {

            var modalStory = $modal.open({
                templateUrl: 'modules/stories/views/edit-story.client.view.html',
                controller: function ($scope, $modalInstance, story) {
                    $scope.story = story;

                    $scope.ok = function () {
                        //if (updateProjectForm.$valid) {
                        $modalInstance.close($scope.story);
                        //}
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    project: function () {
                        return selectedStory;
                    }
                }
            });

            modalStory.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    }
]);

storiesApp.directive('stickyNote', function(Socket, $log) {
        var linker = function(scope, element, attrs) {
            element.draggable({
                containment: '.containment-wrapper',
                stop: function(event, ui) {
                    scope.note.storyPosX = ui.position.left;
                    scope.note.storyPosY = ui.position.top;
                    scope.note.$update({ storyId: scope.note._id });
                    Socket.emit('story.moved', {
                        _id: scope.note._id,
                        x: ui.position.left,
                        y: ui.position.top
                    });
                }
            });

            Socket.on('on.story.moved', function(data) {
                // Update if the same note
                if(data._id === scope.note._id) {
                    element.animate({
                        left: data.x,
                        top: data.y
                    });
                }
            });

            // Some DOM initiation to make it nice
            element.css('left', scope.note.storyPosX + 'px');
            element.css('top',  scope.note.storyPosY + 'px');
            element.hide().fadeIn();
        };

        var controller = function($scope) {
            // Incoming
            Socket.on('on.story.updated', function(data) {
                // Update if the same note
                if(data._id === $scope.note._id) {
                    $scope.note.storyTitle = data.storyTitle;
                    $scope.note.storyDescription = data.storyDescription;
                }
            });

            // Outgoing
            $scope.updateNote = function(note) {
                Socket.emit('story.updated', note);
            };

            $scope.deleteNote = function(id) {
                $log.info('as');
                $scope.ondelete({
                    id: id
                });
            };
        };

        return {
            restrict: 'A',
            link: linker,
            controller: controller,
            scope: {
                note: '=',
                ondelete: '&'
            }
        };
    });*/

var storiesApp = angular.module('stories');

storiesApp.directive('stickyNote', ['Socket', function(Socket) {
    var linker = function(scope, element, attrs) {
        element.draggable({
            containment: '.containment-wrapper',
            stop: function(event, ui) {
                Socket.emit('story.moved', {
                    id: scope.story._id,
                    x: ui.position.left,
                    y: ui.position.top
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
        element.hide().fadeIn();
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

storiesApp.controller('StoriesController', ['$scope', 'Socket', 'Stories', 'Authentication', '$location', '$stateParams', '$modal',
    function($scope, Socket, Stories, Authentication, $location, $stateParams, $modal) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.stories = Stories.query({ projectId: $stateParams.projectId });

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
                Socket.emit('story.created', story);
            });
        };

        $scope.deleteStory = function(story) {
            $scope.handleDeletedStory(story._id);
            Socket.emit('story.deleted', {id: story._id});
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
            Socket.emit('story.updated', story);
        };

        $scope.editStory = function (size, selectedStory) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/stories/views/edit-story.client.view.html',
                controller: function ($scope, $modalInstance, story) {
                    $scope.story = story;

                    $scope.ok = function () {
                        //if (updateProjectForm.$valid) {
                        $modalInstance.close($scope.story);
                        //}
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

storiesApp.controller('StoriesEditController', function ($scope, $stateParams, Authentication, $location) {
    $scope.authentication = Authentication;

    // If user is not signed in then redirect back home
    if (!$scope.authentication.user) $location.path('/');

    $scope.update = function (updatedProject) {
        var project = updatedProject;

        project.$update(function (response) {

        }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
        });
    };
});
