/**
 * Created by J. Ricardo de Juan Cajide on 8/19/14.
 */
var mongoose = require('mongoose');

//Schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String
});

//Model
var User = mongoose.model('users', UserSchema);

module.exports = User;

User.schema.path('email').validate(function (value, res) {
    User.findOne({ email: value}, function (err, user) {
        if (user) {
            res(false);
        } else {
            res(true);
        }
    })
}, 'This email addres is already registered');

User.schema.path('password').set(function (value) {
    if (value.length < 8 ) {
        return new Error('Password must be more than 8 characters.');
    } else {
        return value;
    }
});