/**
 * Created by J. Ricardo de Juan Cajide on 11/23/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SprintReviewSchema = new Schema({
    notes: {
        type: String,
        trim: true
    },
    problems: {
        type: String,
        trim: true
    },
    sprintId: {
        type: Schema.Types.ObjectId,
        ref: 'Sprint',
        required: true
    },
    finishedStories: [{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    }],
    pendingStories: [{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    }]
});

var SprintReview = mongoose.model('SprintReview', SprintReviewSchema);
