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
    return (property && property.length <= 20);
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
        enum: ['VERY HIGH', 'HIGH', 'MEDIUM', 'LOW', 'VERY LOW']
    },
    taskHours: {
        type: Number,
        required: true
    },
    taskRemark: {
        type: String,
        trim: true
    },
    taskRuleValidation: {
        type: String,
        trim: true
    },
    taskFinished: {
        type: Boolean,
        default: false
    },
    storyId: {
        type: Schema.Types.ObjectId,
        ref: 'Story',
        required: true
    },
    phaseId: {
        type: Schema.Types.ObjectId,
        ref: 'Phase'
    },
    position: {
        type: Number,
        default: 0
    }

});

var Task = mongoose.model('Task', TaskSchema);
