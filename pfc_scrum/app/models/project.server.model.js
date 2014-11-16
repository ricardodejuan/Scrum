/**
 * Created by J. Ricardo de Juan Cajide on 9/17/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var _ = require('lodash');
var ObjectId = mongoose.Types.ObjectId;


/**
 * A Validation function for properties
 */
var validateProperty = function(property) {
    return (property && property.length < 17);
};

var ProjectSchema = new Schema({
    projectName: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        validate: [validateProperty, 'Project Name must be between 1 and 16 characters']
    },
    descriptionName: {
        type: String,
        default: '',
        trim: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    users: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        role: [{
            type: String,
            enum: ['SCRUM_MASTER', 'PRODUCT_OWNER', 'TEAM', 'STAKEHOLDER']
        }],
        admin: {
            type: Boolean,
            default: false
        },
        _id: false
    }],
    burnDownChart: {
        burnDownChartName: {
            type: String,
            required: true,
            trim: true,
            default: 'Burndown Chart'
        },
        workingDays: {
            type: Number
        },
        estimatePoints: {
            type: Number
        },
        remainingPoints: {
            type: Number
        }
    },
    productBackLog: {
        risks: [{
            type: String,
            trim: true
        }]
    }
});

ProjectSchema.methods = {

    addUsers: function (users, callback) {
        var _this = this;
        var usersToGo = users.length;

        _.forEach(users, function (user) {
            var index = _.findIndex(_this.users, { 'userId': new ObjectId(user._id) });
            if (index === -1) {
                var u = {'userId': new ObjectId(user._id)};
                _this.users.addToSet (u);
                if (--usersToGo === 0) {
                    _this.save(callback);
                }
            } else {
                callback(new Error('User is already joined'));
            }
        });
    },

    deleteUser: function (userId, callback) {
        var _this = this;

        var index = _.findIndex(_this.users, { userId: userId });
        if (~index) {
            _this.users.splice(index, 1);
            _this.save(callback);
        } else {
            callback(new Error('UserId does not match'));
        }
    }

};

var Project = mongoose.model('Project', ProjectSchema);
