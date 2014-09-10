/**
 * Created by J. Ricardo de Juan Cajide on 8/19/14.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//Schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, required: true, trim: true, index: { unique: true } },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, index: { unique: true } },
    password: { type: String, required: true, trim: true },
    date_joined: { type: Date, default: Date.now },
    birth_date: { type: Date, default: '' },
    location: { type: String, default: '' },
    web: { type: String, default: '' },
    photo: { type: String, default: '' },
    is_admin: { type: Boolean, default: false }
});

UserSchema.pre('save', function (callback) {
    var user = this;

    if (!user.isModified('password')) return callback();

    bcrypt.genSalt(5, function (err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        })
    })
});

UserSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
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

UserSchema.statics.existUsername = function (username, callback) {
    this.count( {username: username}, callback);
};

UserSchema.statics.existEmail = function (email, callback) {
    this.count( {email: email}, callback);
};

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

module.exports = User;