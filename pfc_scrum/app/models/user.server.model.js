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

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
    return (this.provider !== 'local' || (password && password.length > 8));
};

var UserSchema = new Schema({
    firstName: {
        type: String,
        default: '',
        required: true,
        trim: true,
        validate: [validateLocalStrategyProperty, 'Please fill in your first name']
    },
    lastName: {
        type: String,
        default: '',
        required: true,
        trim: true,
        validate: [validateLocalStrategyProperty, 'Please fill in your last name']
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
        default: '',
        required: 'Please fill in an email',
        validate: [validateLocalStrategyProperty, 'Please fill in your email'],
        trim: true,
        index: { unique: true }
    },
    password: {
        type: String,
        default: '',
        required: true,
        trim: true,
        validate: [validateLocalStrategyPassword, 'Password should be longer']
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerData: {},
    additionalProvidersData: {},
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
    }
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

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueEmail = function(email, suffix, callback) {
    var _this = this;
    var possibleEmail = email + (suffix || '');

    _this.findOne({
        email: possibleEmail
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleEmail);
            } else {
                return _this.findUniqueEmail(email, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

/*UserSchema.virtual('full_name').get(function () {
    return this.first_name + " " + this.last_name;
});*/

/*UserSchema.statics.findByEmail = function (email, callback) {
    if (!email) {
        return callback(new Error('errors.missingEmail'), null);
    }
    else {
        var q = this.find({ email: email }).limit(1);
        console.log("a");
        q.exec(function (err, user) {
            if (err) {
                console.log("b");

                return true;
            }
            else {
                console.log(user);

                return true;
            }
        })
    }
};*/

// Register Model
var User = mongoose.model('User', UserSchema);

/*User.schema.path('email').validate(function (value, res) {
    User.findOne({ email: value}, function (err, user) {
        if (user) {
            return res(false);
        } else {
            return res(true);
        }
    })
}, 'This email addres is already registered');
/*
User.schema.path('password').set(function (value) {
    if (value.length < 8 ) {
        return new Error('Password must be more than 8 characters.');
    } else {
        return value;
    }
});*/