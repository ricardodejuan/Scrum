/**
 * Created by J. Ricardo de Juan Cajide on 10/5/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Story = mongoose.model('Story'),
    Project = mongoose.model('Project'),
    Task = mongoose.model('Task'),
    _ = require('lodash'),
    ObjectId = mongoose.Types.ObjectId;


/**
 * Create a story
 */
exports.create = function(req, res) {
    var data = { storyTitle: req.body.storyTitle,
                 storyDescription: req.body.storyDescription,
                 storyValue: req.body.storyValue,
                 storyPoint: req.body.storyPoint,
                 storyPriority: req.body.storyPriority,
                 storyPosX: req.body.storyPosX,
                 storyPosY: req.body.storyPosY,
                 users: req.body.users,
                 projectId: req.params.projectId
               };
    var story = new Story(data);

    story.save(function(err, story) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(201).jsonp(story);
        }
    });
};


/**
 * List of Stories
 */
exports.list = function(req, res) {
    var query = { 'projectId': req.params.projectId, 'sprintId': { $exists: false } };

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


/**
 * List ALL Stories
 */
exports.allStories = function(req, res) {
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
    var data = { storyTitle: req.body.storyTitle,
                 storyDescription: req.body.storyDescription,
                 storyValue: req.body.storyValue,
                 storyPoint: req.body.storyPoint,
                 storyPriority: req.body.storyPriority,
                 storyFinished: req.body.storyFinished,
                 storyPosX: req.body.storyPosX,
                 storyPosY: req.body.storyPosY,
                 users: req.body.users
    };

    Story.findOne(query).exec(function (err, story) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            story = _.extend(story, data);
            
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
 * Sprint Backlog. Send US to Sprint Backlog
 */
exports.backlog = function (req, res) {
    var data = req.body.story;
    var query = { _id: data._id };
    var doc = { $set: { sprintId: req.body.sprintId } };
    var multi = { multi: true };

    Story.update(query, doc, multi).exec(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.send({message: 'User story has been added to Sprint Backlog.'});
        }
    });

};

/**
 * Return US to ProductBacklog
 */
exports.productBacklog = function (req, res) {
    var query = { _id: req.params.storyId };
    var doc = { $unset: { sprintId: 1 } };

    Story.update(query, doc).exec(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var q = { storyId: req.params.storyId };
            var d = { $unset: { phaseId: 1 } };
            var m = { multi: true };

            Task.update(q, d, m).exec();
            res.send({message: 'User stories have been removed from Sprint Backlog.'});
        }
    });

};

/*
 * Project authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    var user = req.user;
    var query = { _id: req.params.projectId, 'users.userId': user._id };

    Project.findOne(query).count().exec(function(err, amount) {
        if (err) {console.log('123'); return next(err);}
        if (!amount) return res.status(403).send({
            message: 'User is not authorized'
        });
        next();
    });
};