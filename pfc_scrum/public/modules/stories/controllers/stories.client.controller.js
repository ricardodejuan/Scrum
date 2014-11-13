/**
 * Created by J. Ricardo de Juan Cajide on 11/9/14.
 */
'use strict';

var storiesApp = angular.module('stories');

storiesApp.controller('StoriesController', ['$scope', 'Authentication', 'Stories', '$location', 'Socket', '$log', '$stateParams',
    function($scope, Authentication, Stories, $location, Socket, $log, $stateParams) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        // Find stories list
        $scope.notes = Stories.query({ projectId: $stateParams.projectId });

        // Incoming
        Socket.on('on.story.created', function(story) {
            $scope.notes.push( new Stories(story) );
        });

        Socket.on('on.story.deleted', function(story) {
            $scope.handleDeletedNoted(story);
        });

        // Outgoing
        $scope.createNote = function() {
            var note = new Stories({
                storyTitle: 'New Story',
                storyDescription: 'Description',
                storyValue: 1,
                storyPoint: 1
            });
            
            note.$save({ projectId: $stateParams.projectId }, function (story) {
                $scope.notes.push(story);
                Socket.emit('story.created', story);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.deleteNote = function(story) {
            story.$remove({ projectId: $stateParams.projectId, storyId: story._id }, function (response) {
                $scope.handleDeletedNoted(story);
                Socket.emit('story.deleted', story);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.handleDeletedNoted = function(data) {
            var index = $scope.notes.indexOf(data);
            $scope.notes.splice(index, 1);
        };

    }
])
    .directive('stickyNote', function(Socket) {
        var linker = function(scope, element, attrs) {
            element.draggable({ containment: '.containment-wrapper',
                stop: function(event, ui) {
                    Socket.emit('moveNote', {
                        id: scope.note.id,
                        x: ui.position.left,
                        y: ui.position.top
                    });
                }
            });

            Socket.on('onNoteMoved', function(data) {
                // Update if the same note
                if(data.id === scope.note.id) {
                    element.animate({
                        left: data.x,
                        top: data.y
                    });
                }
            });

            // Some DOM initiation to make it nice
            element.css('left', '70px');
            element.css('top', '120px');
            element.hide().fadeIn();
        };

        var controller = function($scope) {
            // Incoming
            Socket.on('onNoteUpdated', function(data) {
                // Update if the same note
                if(data.id === $scope.note.id) {
                    $scope.note.title = data.title;
                    $scope.note.body = data.body;
                }
            });

            // Outgoing
            $scope.updateNote = function(note) {
                Socket.emit('updateNote', note);
            };

            $scope.deleteNote = function(id) {
                $scope.ondelete({
                    story: id
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
    });