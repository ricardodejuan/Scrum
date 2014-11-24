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

angular.module('stories').factory('SocketPB', function($rootScope) {
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
});