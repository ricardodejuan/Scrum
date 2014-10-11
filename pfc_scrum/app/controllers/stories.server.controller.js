/**
 * Created by J. Ricardo de Juan Cajide on 10/5/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Story = mongoose.model('Story'),
    Project = mongoose.model('Project'),
    _ = require('lodash');


/**
 * Create a story
 */
exports.create = function(req, res) {
    var story = new Story(req.body.story);

    story.save(function(err, doc) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(201).jsonp(doc);
        }
    });
};


/**
 * List of Stories
 */
exports.list = function(req, res) {
    var query = { 'projectId': req.params.projectId };

    Story.find(query).exec(function(err, stories) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(stories);
        }
    });
};

/*
 * Load a Story
 */
exports.load = function (req, res) {
    var query = { _id: req.params.storyId };

    Story.findOne(query).exec(function (err, story) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(story);
        }
    });
};

/*
 * Update a Story
 */
exports.update = function (req, res) {
    var query = { _id: req.params.storyId };
    var body = req.body.story;

    Story.findOne(query).exec(function (err, story) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            story = _.extend(story, body);
            
            story.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(story);
                }
            });
        }
    });
};

/*
 * Delete a Story
 */
exports.delete = function (req, res) {
    var query = { _id: req.params.storyId };

    Story.remove(query).exec(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.send({message: 'Story has been removed.'});
        }
    });
};

/*
 * Project authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    var user = req.user;
    var query = { _id: req.params.projectId, "users.userId": user._id};

    Project.findOne(query).count().exec(function(err, amount) {
        if (err) return next(err);
        if (!amount) return res.status(403).send({
            message: 'User is not authorized'
        });
        next();
    });
};