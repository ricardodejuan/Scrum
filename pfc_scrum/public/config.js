/**
 * Created by J. Ricardo de Juan Cajide on 9/14/14.
 */
'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var applicationModuleName = 'Scrum';
    var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'btford.socket-io', 'xeditable', 'ngDragDrop', 'tc.chartjs'];

    // Add a new vertical module
    var registerModule = function(moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);

        // Bootstrap3 theme. Can be also 'bs2', 'default'
        angular.module(moduleName).run(function(editableOptions) {
            editableOptions.theme = 'bs3';
        });
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };

})();