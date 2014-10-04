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