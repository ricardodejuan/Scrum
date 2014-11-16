/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var applicationModuleName = 'Scrum';
    var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'btford.socket-io'];

    // Add a new vertical module
    var registerModule = function(moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };

})();
/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
/**
 * Created by J. Ricardo de Juan Cajide on 10/16/14.
 */
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('projects');
/**
 * Created by J. Ricardo de Juan Cajide on 11/8/14.
 */
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('stories');
/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.
            state('home', {
                url: '/',
                templateUrl: 'modules/core/views/home.client.view.html'
            });
    }
]);
/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
    function($scope, Authentication, Menus) {
        $scope.authentication = Authentication;
        $scope.isCollapsed = false;
        $scope.menu = Menus.getMenu('topbar');

        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function() {
            $scope.isCollapsed = false;
        });
    }
]);
/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
    }
]);
/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

    function() {
        // Define a set of default roles
        this.defaultRoles = ['*'];

        // Define the menus object
        this.menus = {};

        // A private function for rendering decision
        var shouldRender = function(user) {
            if (user) {
                if (!!~this.roles.indexOf('*')) {
                    return true;
                } else {
                    for (var userRoleIndex in user.roles) {
                        for (var roleIndex in this.roles) {
                            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                                return true;
                            }
                        }
                    }
                }
            } else {
                return this.isPublic;
            }

            return false;
        };

        // Validate menu existance
        this.validateMenuExistance = function(menuId) {
            if (menuId && menuId.length) {
                if (this.menus[menuId]) {
                    return true;
                } else {
                    throw new Error('Menu does not exists');
                }
            } else {
                throw new Error('MenuId was not provided');
            }

            return false;
        };

        // Get the menu object by menu id
        this.getMenu = function(menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            return this.menus[menuId];
        };

        // Add new menu object by menu id
        this.addMenu = function(menuId, isPublic, roles) {
            // Create the new menu
            this.menus[menuId] = {
                isPublic: isPublic || false,
                roles: roles || this.defaultRoles,
                items: [],
                shouldRender: shouldRender
            };

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenu = function(menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            delete this.menus[menuId];
        };

        // Add menu item object
        this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Push new menu item
            this.menus[menuId].items.push({
                title: menuItemTitle,
                link: menuItemURL,
                menuItemType: menuItemType || 'item',
                menuItemClass: menuItemType,
                uiRoute: menuItemUIRoute || ('/' + menuItemURL),
                isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
                roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
                position: position || 0,
                items: [],
                shouldRender: shouldRender
            });

            // Return the menu object
            return this.menus[menuId];
        };

        // Add submenu item object
        this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
                    // Push new submenu item
                    this.menus[menuId].items[itemIndex].items.push({
                        title: menuItemTitle,
                        link: menuItemURL,
                        uiRoute: menuItemUIRoute || ('/' + menuItemURL),
                        isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
                        roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
                        position: position || 0,
                        shouldRender: shouldRender
                    });
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenuItem = function(menuId, menuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
                    this.menus[menuId].items.splice(itemIndex, 1);
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeSubMenuItem = function(menuId, submenuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
                    if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
                        this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
                    }
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        //Adding the topbar menu
        this.addMenu('topbar');
    }
]);
/**
 * Created by J. Ricardo de Juan Cajide on 10/16/14.
 */
'use strict';

// Configuring the Projects module
angular.module('projects').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Projects', 'projects', 'dropdown', '/projects(/create)?');
        Menus.addSubMenuItem('topbar', 'projects', 'List Projects', 'projects');
        Menus.addSubMenuItem('topbar', 'projects', 'New Project', 'projects/create');
    }
]);
/**
 * Created by J. Ricardo de Juan Cajide on 10/16/14.
 */
'use strict';

// Setting up route
angular.module('projects').config(['$stateProvider',
    function($stateProvider) {
        // Articles state routing
        $stateProvider.
            state('listProjects', {
                url: '/projects',
                templateUrl: 'modules/projects/views/list-projects.client.view.html'
            }).
            state('createProject', {
                url: '/projects/create',
                templateUrl: 'modules/projects/views/create-project.client.view.html'
            }).
            state('viewProject', {
                url: '/projects/:projectId',
                templateUrl: 'modules/projects/views/view-project.client.view.html'
            }).
            state('viewProject.listStories', {
                url: '/stories',
                templateUrl: 'modules/stories/views/list-stories.client.view.html'
            }).
            state('viewProjects.createSprint', {
                url: '/sprints',
                templateUrl: 'modules/sprints/views/create-sprint.client.view.html'
            });
    }
]);
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

projectsApp.controller('ProjectsViewController', ['$scope', '$stateParams', 'Authentication', 'Projects', '$modal', '$log', '$http', '$location',
    function($scope, $stateParams, Authentication, Projects, $modal, $log, $http, $location) {
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
                controller: ["$scope", "$modalInstance", "project", function ($scope, $modalInstance, project) {
                    $scope.project = project;

                    $scope.ok = function () {
                        //if (updateProjectForm.$valid) {
                            $modalInstance.close($scope.project);
                        //}
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
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
                controller: ["$scope", "$modalInstance", "users", function ($scope, $modalInstance, users) {

                    $scope.users = users;

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
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
                controller: ["$scope", "$modalInstance", "project", function ($scope, $modalInstance, project) {
                    $scope.project = project;

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
                size: size,
                resolve: {
                    project: function () {
                        return selectedProject;
                    }
                }

            });
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
/**
 * Created by J. Ricardo de Juan Cajide on 10/19/14.
 */
'use strict';

//Projects service used for communicating with the projects REST endpoints
angular.module('projects').factory('Projects', ['$resource', '$http',
    function($resource) {
        return $resource('projects/:projectId', { projectId: '@_id' }, {
            update: {
                method: 'PUT'
            }
        });
    }
])
    .factory('ProjectsNonMembers', ['$http',
    function($http) {
        var nonMembersRequest = function (projectId, username) {
            return $http.get('/projects/' + projectId + '/nonmembers/' + username);
        };

        return {
            nonMembers: function (projectId, username) { return nonMembersRequest(projectId, username); }
        };
    }
]);
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

    var controller = ["$scope", function($scope) {
        // Incoming
        Socket.on('on.story.updated', function(story) {
            // Update if the same story
            if(story._id === $scope.story._id) {
                $scope.story.storyTitle = story.storyTitle;
                $scope.story.storyDescription = story.storyDescription;

            }
        });
    }];

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
                controller: ["$scope", "$modalInstance", "story", function ($scope, $modalInstance, story) {
                    $scope.story = story;

                    $scope.ok = function () {
                        $modalInstance.close($scope.story);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
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

/**
 * Created by J. Ricardo de Juan Cajide on 11/10/14.
 */
'use strict';

/*global io:false */

//socket factory that provides the socket service
/*angular.module('core').factory('Socket', ['socketFactory', '$location',
    function(socketFactory, $location) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect( $location.protocol() +'://' + $location.host() + ':' + $location.port() )
        });
    }
]);*/

angular.module('stories').factory('Socket', ["$rootScope", function($rootScope) {
    var socket = io('/stories').connect();
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
}]);
/**
 * Created by J. Ricardo de Juan Cajide on 11/8/14.
 */
'use strict';

//Stories service used for communicating with the stories REST endpoints
angular.module('stories').factory('Stories', ['$resource',
    function($resource) {
        return $resource('projects/:projectId/stories/:storyId', { projectId: '@projectId', storyId: '@storyId' }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
    function($httpProvider) {
        // Set the httpProvider "not authorized" interceptor
        $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
            function($q, $location, Authentication) {
                return {
                    responseError: function(rejection) {
                        switch (rejection.status) {
                            case 401:
                                // Deauthenticate the global user
                                Authentication.user = null;

                                // Redirect to signin page
                                $location.path('signin');
                                break;
                            case 403:
                                // Add unauthorized behaviour
                                break;
                        }

                        return $q.reject(rejection);
                    }
                };
            }
        ]);
    }
]);
/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
    function($stateProvider) {
        // Users state routing
        $stateProvider.
            state('profile', {
                url: '/settings/profile',
                templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
            }).
            state('password', {
                url: '/settings/password',
                templateUrl: 'modules/users/views/settings/change-password.client.view.html'
            }).
            state('signup', {
                url: '/signup',
                templateUrl: 'modules/users/views/authentication/signup.client.view.html'
            }).
            state('signin', {
                url: '/signin',
                templateUrl: 'modules/users/views/authentication/signin.client.view.html'
            }).
            state('forgot', {
                url: '/password/forgot',
                templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
            }).
            state('reset-invalid', {
                url: '/password/reset/invalid',
                templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
            }).
            state('reset-success', {
                url: '/password/reset/success',
                templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
            }).
            state('reset', {
                url: '/password/reset/:token',
                templateUrl: 'modules/users/views/password/reset-password.client.view.html'
            });
    }
]);
/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {
        $scope.authentication = Authentication;

        // If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');

        $scope.signup = function() {
            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.signin = function() {
            $http.post('/auth/signin', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);
/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
    function($scope, $stateParams, $http, $location, Authentication) {
        $scope.authentication = Authentication;

        //If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');

        // Submit forgotten password account id
        $scope.askForPasswordReset = function() {
            $scope.success = $scope.error = null;

            $http.post('/auth/forgot', $scope.credentials).success(function(response) {
                // Show user success message and clear form
                $scope.credentials = null;
                $scope.success = response.message;

            }).error(function(response) {
                // Show user error message and clear form
                $scope.credentials = null;
                $scope.error = response.message;
            });
        };

        // Change user password
        $scope.resetUserPassword = function() {
            $scope.success = $scope.error = null;

            $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
                // If successful show success message and clear form
                $scope.passwordDetails = null;

                // Attach user profile
                Authentication.user = response;

                // And redirect to the index page
                $location.path('/password/reset/success');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);
/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
    function($scope, $http, $location, Users, Authentication) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');

        // Update a user profile
        $scope.updateUserProfile = function(isValid) {
            if (isValid){
                $scope.success = $scope.error = null;
                var user = new Users($scope.user);

                user.$update(function(response) {
                    $scope.success = true;
                    Authentication.user = response;
                }, function(response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        // Change user password
        $scope.changeUserPassword = function() {
            $scope.success = $scope.error = null;

            $http.post('/users/password', $scope.passwordDetails).success(function(response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);
/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

    function() {
        var _this = this;

        _this._data = {
            user: window.user
        };

        return _this._data;
    }
]);
/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
    function($resource) {
        return $resource('users', {}, {
            update: {
                method: 'PUT'
            }
        });
    }
]);