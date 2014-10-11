/**
 * Created by J. Ricardo de Juan Cajide on 10/4/14.
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
    return (property.length < 17);
};

var StorySchema = new Schema({
    storyTitle: {
        type: String,
        required: true,
        trim: true,
        validate: [validateProperty, 'Story Title must be between 0 and 16 characters']
    },
    storyDescription: {
        type: String,
        required: true,
        trim: true
    },
    storyValue: {
        type: Number,
        required: true
    },
    storyPoint: {
        type: Number,
        required: true
    },
    storyPriority: {
        type: String,
        required: true,
        enum: ['MUST', 'SHOULD', 'COULD', 'WON\'T']
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    sprintId: {
        type: Schema.Types.ObjectId,
        ref: 'Sprint'
    }
});

var Story = mongoose.model('Story', StorySchema);