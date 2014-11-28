/**
 * Created by J. Ricardo de Juan Cajide on 11/25/14.
 */
'use strict';


var dailiesApp = angular.module('dailies');

dailiesApp.controller('DailyScrumController', ['$scope', '$stateParams', 'Authentication', '$location', 'Dailies', '$modal',
    function ($scope, $stateParams, Authentication, $location, Dailies, $modal) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.dailies = Dailies.query({ sprintId: $stateParams.sprintId});

        $scope.createDaily = function () {
            var ds = new Dailies({
                did: '',
                willDo: '',
                impediments: '',
                date: new Date(),
                sprintId: $stateParams.sprintId
            });

            ds.$save({ sprintId: $stateParams.sprintId }, function(daily) {
                $scope.dailies.push(daily);
            });
        };

        $scope.editDaily = function (size, selectedDaily) {
            $modal.open({
                templateUrl: 'modules/dailies/views/view-daily.client.view.html',
                controller: function ($scope, $modalInstance, daily) {

                    $scope.daily = daily;

                    $scope.ok = function () {
                        $modalInstance.close($scope.daily);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };

                },
                size: size,
                resolve: {
                    daily: function () {
                        return selectedDaily;
                    }
                }
            });
        };
    }
]);

dailiesApp.controller('DailyScrumUpdateController', ['$scope', '$stateParams', 'Authentication', '$location', 'Dailies',
    function ($scope, $stateParams, Authentication, $location, Dailies) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

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

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.update = function(updatedDaily) {
            var daily = updatedDaily;

            daily.$update({ sprintId: $stateParams.sprintId, dailyId: daily._id } ,function(response) {

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);