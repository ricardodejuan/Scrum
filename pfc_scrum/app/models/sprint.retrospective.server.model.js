/**
 * Created by J. Ricardo de Juan Cajide on 11/23/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SprintRetrospectiveSchema = new Schema({
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
    },
    sprintId: {
        type: Schema.Types.ObjectId,
        ref: 'Sprint',
        required: true
    }
});

var SprintRetrospective = mongoose.model('SprintRetrospective', SprintRetrospectiveSchema);
