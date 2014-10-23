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
    return (property && property.length < 21);
};

var SprintSchema = new Schema({
    sprintName: {
        type: String,
        required: true,
        trim: true,
        validate: [validateProperty, 'Sprint Title must be between 0 and 21 characters']
    },
    sprintDescription: {
        type: String,
        trim: true
    },
    sprintStartTime: {
        type: Date
    },
    sprintEstimateTime: {
        type: Date
    },
    sprintEndTime: {
        type: Date
    },
    sprintState: {
        type: String,
        required: true,
        enum: ['PAST', 'PRESENT', 'FUTURE']
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }
});

var Sprint = mongoose.model('Sprint', SprintSchema);
