/**
 * Created by J. Ricardo de Juan Cajide on 9/9/14.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('mongoose').model('User');

module.exports = function() {
    // Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, callback) {
            User.findOne({
                username: username
            }, function(err, user) {
                if (err) {
                    return callback(err);
                }
                if (!user) {
                    return callback(null, false, {
                        message: 'Unknown user or invalid password'
                    });
                }
                if (!user.authenticate(password)) {
                    return callback(null, false, {
                        message: 'Unknown user or invalid password'
                    });
                }

                return callback(null, user);
            });
        }
    ));
};
