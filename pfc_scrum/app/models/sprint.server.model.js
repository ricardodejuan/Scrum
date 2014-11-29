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
        type: Date,
        required: true
    },
    sprintEndTime: {
        type: Date,
        required: true
    },
    sprintFinished: {
        type: Boolean,
        default: false
    },
    sprintBurnDownChart : [{
        storyPoints: {
            type: Number
        },
        day: {
            type: Number
        },
        _id: false
    }],
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    sprintReviewMeeting: {
        notes: {
            type: String,
            trim: true
        },
        sprintPlanningDate: {
            type: Date
        }
    },
    sprintRetrospectiveMeeting: {
        goodWork: {
            type: String,
            trim: true
        },
        badWork: {
            type: String,
            trim: true
        },
        learn: {
            type: String,
            trim: true
        },
        improve: {
            type: String,
            trim: true
        },
        problems: {
            type: String,
            trim: true
        }
    }
});

var Sprint = mongoose.model('Sprint', SprintSchema);
