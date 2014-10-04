/**
 * Created by J. Ricardo de Juan Cajide on 9/28/14.
 */
'use strict';

/**
 * A Validation function for properties
 */
var validateProperty = function(property) {
    return (property.length);
};

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
        type: String
    }],
    isFinished: {
        type: Boolean
    }
});