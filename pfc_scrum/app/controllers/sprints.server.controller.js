/**
 * Created by J. Ricardo de Juan Cajide on 10/8/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Sprint = mongoose.model('Sprint'),
    Project = mongoose.model('Project'),
    Story = mongoose.model('Story'),
    _ = require('lodash');


/**
 * Create a sprint
 */
exports.create = function(req, res) {
    var data = { sprintName: req.body.sprintName,
                 sprintDescription: req.body.sprintDescription,
                 sprintStartTime: req.body.sprintStartTime,
                 sprintEstimateTime: req.body.sprintEstimateTime,
                 sprintEndTime: req.body.sprintEndTime,
                 sprintFinished: req.body.sprintFinished,
                 projectId: req.params.projectId };
    var sprint = new Sprint(data);

    sprint.save(function(err, doc) {
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
 * List of Sprints
 */
exports.list = function(req, res) {
    var query = { 'projectId': req.params.projectId };
    var projection = { sprintName: 1 };

    Sprint.find(query, projection).exec(function(err, sprints) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(sprints);
        }
    });
};

/*
 * Load a Sprint
 */
exports.load = function (req, res) {
    var query = { _id: req.params.sprintId };

    Sprint.findOne(query).exec(function (err, sprint) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(sprint);
        }
    });
};

/*
 * Update a Sprint
 */
exports.update = function (req, res) {
    var query = { _id: req.params.sprintId };
    var data = { sprintName: req.body.sprintName,
                 sprintDescription: req.body.sprintDescription,
                 sprintStartTime: req.body.sprintStartTime,
                 sprintEstimateTime: req.body.sprintEstimateTime,
                 sprintEndTime: req.body.sprintEndTime,
                 sprintFinished: req.body.sprintFinished };

    Sprint.findOne(query).exec(function (err, sprint) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            sprint = _.extend(sprint, data);

            sprint.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(sprint);
                }
            });
        }
    });
};

/*
 * Delete a Sprint
 */
exports.delete = function (req, res) {
    var query = { _id: req.params.sprintId };

    Sprint.remove(query).exec(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.send({message: 'Sprint has been removed.'});
        }
    });
};

/*
 * Sprint Backlog
 */
exports.backlog = function (req, res) {
    var data = req.body.stories;
    var query = { _id: { $in: data }, projectId: req.params.projectId  };
    var doc = { $set: { sprintId: req.params.sprintId } };
    var multi = { multi: true };

    Story.update(query, doc, multi).exec(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.send({message: 'User stories have been added.'});
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
        if (err) return next(err);
        if (!amount) return res.status(403).send({
            message: 'User is not authorized'
        });
        next();
    });
};