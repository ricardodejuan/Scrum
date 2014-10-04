/**
 * Created by J. Ricardo de Juan Cajide on 8/19/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var _ = require('lodash');

/**
 * A Validation function for properties
 */
var validateProperty = function(property) {
    return (property.length);
};

/**
 * A Validation function for password
 */
var validatePassword = function(password) {
    return (password && password.length > 8);
};

var UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        validate: [validateProperty, 'Please fill in your first name']
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate: [validateProperty, 'Please fill in your last name']
    },
    displayName: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        required: 'Please fill in a username',
        trim: true,
        index: { unique: true }
    },
    email: {
        type: String,
        required: 'Please fill in an email',
        validate: [validateProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        trim: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: [validatePassword, 'Password should be longer']
    },
    salt: {
        type: String
    },
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],
        default: ['user']
    },
    updated: {
        type:Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }]
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
    if (this.password && this.password.length > 8) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

/*
 * Delete project
 */
UserSchema.methods.deleteProject = function (projectId, callback) {
    var _this = this;

    var index = _.findIndex(_this.projects, projectId);

    if (~index) {
        _this.projects.splice(index, 1);
        _this.save(callback);
    } else {
        callback(new Error('Project does not exist'));
    }
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

/*UserSchema.virtual('full_name').get(function () {
    return this.first_name + " " + this.last_name;
});*/

// Register Model
var User = mongoose.model('User', UserSchema);