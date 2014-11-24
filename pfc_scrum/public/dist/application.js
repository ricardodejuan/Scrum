/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var applicationModuleName = 'Scrum';
    var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'btford.socket-io', 'xeditable', 'ngDragDrop'];

    // Add a new vertical module
    var registerModule = function(moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);

        // Bootstrap3 theme. Can be also 'bs2', 'default'
        angular.module(moduleName).run(["editableOptions", function(editableOptions) {
            editableOptions.theme = 'bs3';
        }]);
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
 * Created by J. Ricardo de Juan Cajide on 11/17/14.
 */
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('phases');
/**
 * Created by J. Ricardo de Juan Cajide on 10/16/14.
 */
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('projects');
/**
 * Created by J. Ricardo de Juan Cajide on 11/16/14.
 */
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('sprints');
/**
 * Created by J. Ricardo de Juan Cajide on 11/8/14.
 */
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('stories');
/**
 * Created by J. Ricardo de Juan Cajide on 11/18/14.
 */
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('tasks');
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
 * Created by J. Ricardo de Juan Cajide on 11/17/14.
 */
'use strict';

//Phases service used for communicating with the projects REST endpoints
angular.module('phases').factory('Phases', ['$resource',
    function($resource) {
        return $resource('sprints/:sprintId/phases/:phaseId', { sprintId: '@sprintId', phaseId: '@phaseId' }, {
            update: {
                method: 'PUT'
            }
        });
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
            state('viewProject.createSprint', {
                url: '/sprints',
                templateUrl: 'modules/sprints/views/create-sprint.client.view.html'
            }).
            state('viewProject.viewSprint', {
                url: '/sprints/:sprintId',
                templateUrl: 'modules/sprints/views/view-sprint.client.view.html'
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

projectsApp.controller('ProjectsViewController', ['$scope', '$stateParams', 'Authentication', 'Projects', 'Sprints','$modal', '$log', '$http', '$location',
    function($scope, $stateParams, Authentication, Projects, Sprints, $modal, $log, $http, $location) {
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

        // Get sprints
        $scope.getSprints = function (project) {
            $scope.sprints = Sprints.query({ projectId: project._id });
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

        $scope.createPhase = function (phaseName) {
            var p = new Phases({
                phaseName: phaseName,
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
                controller: ["$scope", "$modalInstance", "story", function ($scope, $modalInstance, story) {
                    $scope.story = story;

                    $scope.ok = function () {
                        SocketSprint.emit('story.updated', {story: $scope.story, room: $stateParams.sprintId});
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
        };

        $scope.addTask = function (size, selectedStory) {
            $modal.open({
                templateUrl: 'modules/tasks/views/add-task.client.view.html',
                controller: ["$scope", "$modalInstance", "story", function ($scope, $modalInstance, story) {

                    $scope.story = story;
                    
                    $scope.ok = function () {
                        $modalInstance.close();
                    };

                }],
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
                controller: ["$scope", "$modalInstance", "task", function ($scope, $modalInstance, task) {
                    $scope.task = task;

                    $scope.ok = function () {
                        $modalInstance.close();
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
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
                controller: ["$scope", "$modalInstance", "sprint", function ($scope, $modalInstance, sprint) {
                    $scope.sprint = sprint;

                    $scope.ok = function () {
                        $modalInstance.close($scope.sprint);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
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

angular.module('sprints').factory('SocketSprint', ["$rootScope", function($rootScope) {
    var socket = io('/sprints').connect();
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
 * Created by J. Ricardo de Juan Cajide on 11/16/14.
 */
'use strict';

//Sprints service used for communicating with the stories REST endpoints
angular.module('sprints').factory('Sprints', ['$resource',
    function($resource) {
        return $resource('projects/:projectId/sprints/:sprintId', { projectId: '@projectId', sprintId: '@sprintId' }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
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
        SocketPB.on('on.story.updated', function(story) {
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

        // Outgoing
        $scope.updateStory = function(story) {
            story.$update({ storyId: story._id });
            SocketPB.emit('story.updated', {story: story, room: $stateParams.projectId});
        };

        $scope.editStory = function (size, selectedStory) {

            $modal.open({
                templateUrl: 'modules/stories/views/edit-story.client.view.html',
                controller: ["$scope", "$modalInstance", "story", function ($scope, $modalInstance, story) {
                    $scope.story = story;

                    $scope.ok = function () {
                        SocketPB.emit('story.updated', {story: $scope.story, room: $stateParams.projectId});
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
        };
        
        $scope.moveToSprint = function (size, selectedStory) {

            var sprints = $http.get('/projects/' + $stateParams.projectId + '/sprintNotFinished');
            var moveStory = function (id) {
                $scope.handleDeletedStory(id);
            };
            
            $modal.open({
                templateUrl: 'modules/stories/views/move-to-sprint.client.view.html',
                controller: ["$scope", "$modalInstance", "sprints", "story", function ($scope, $modalInstance, sprints, story) {
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
                }],
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

storiesApp.controller('StoriesEditController', ['$scope', '$stateParams', 'Authentication', '$location',
    function ($scope, $stateParams, Authentication, $location) {
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

angular.module('stories').factory('SocketPB', ["$rootScope", function($rootScope) {
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
        };
    }
]);
/**
 * Created by J. Ricardo de Juan Cajide on 11/18/14.
 */
'use strict';

//Phases service used for communicating with the projects REST endpoints
angular.module('tasks').factory('Tasks', ['$resource',
    function($resource) {
        return $resource('stories/:storyId/tasks/:taskId', { storyId: '@storyId', taskId: '@taskId' }, {
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