/**
 * Created by J. Ricardo de Juan Cajide on 11/23/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DailyScrumSchema = new Schema({
    did: {
        type: String,
        required: true,
        trim: true
    },
    willDo: {
        type: String,
        required: true,
        trim: true
    },
    impediments: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    sprintId: {
        type: Schema.Types.ObjectId,
        ref: 'Sprint',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

var DailyScrum = mongoose.model('DailyScrum', DailyScrumSchema);
