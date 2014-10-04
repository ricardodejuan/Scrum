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