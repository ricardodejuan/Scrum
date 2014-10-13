/**
 * Created by J. Ricardo de Juan Cajide on 9/28/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * A Validation function for properties
 */
var validateProperty = function(property) {
    return (property.length);
};

var TaskSchema = new Schema({
    taskName: {
        type: String,
        required: true,
        trim: true,
        validate: [validateProperty, 'Please fill in Task Name']
    },
    taskDescription: {
        type: String,
        default: '',
        trim: true
    },
    taskPriority: {
        type: String,
        required: true,
        enum: ['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'VERY_LOW']
    },
    taskEstimate: {
        type: Number,
        required: true
    },
    taskRemark: [{
        type: String,
        trim: true
    }],
    taskRuleValidation: [{
        type: String,
        trim: true
    }],
    isFinished: {
        type: Boolean
    },
    storyId: {
        type: Schema.Types.ObjectId,
        ref: 'Story',
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    phase: {
        phaseId: {
            type: Schema.Types.ObjectId,
            ref: 'Phase'
        },
        order: {
            type: Number
        }
    }

});

var Task = mongoose.model('Task', TaskSchema);
