/**
 * Created by J. Ricardo de Juan Cajide on 10/12/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Story = mongoose.model('Story'),
    Task = mongoose.model('Task'),
    _ = require('lodash');


/**
 * Create a task
 */
exports.create = function(req, res) {
    var data = { taskName: req.body.taskName,
                 taskDescription: req.body.taskDescription,
                 taskPriority: req.body.taskPriority,
                 taskHours: req.body.taskHours,
                 taskRemark: req.body.taskRemark,
                 taskRuleValidation: req.body.taskRuleValidation,
                 storyId: req.params.storyId,
                 phase: req.body.phaseId,
                 position: req.body.position
    };
    var task = new Task(data);

    task.save(function(err, doc) {
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
 * List of tasks
 */
exports.list = function(req, res) {
    var query = { 'storyId': req.params.storyId };

    Task.find(query).exec(function(err, tasks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tasks);
        }
    });
};

/*
 * Load a task
 */
exports.load = function (req, res) {
    var query = { _id: req.params.taskId };

    Task.findOne(query).exec(function (err, task) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(task);
        }
    });
};

/*
 * Update a task
 */
exports.update = function (req, res) {
    var query = { _id: req.params.taskId };
    var data = { taskName: req.body.taskName,
                 taskDescription: req.body.taskDescription,
                 taskPriority: req.body.taskPriority,
                 taskHours: req.body.taskHours,
                 taskRemark: req.body.taskRemark,
                 taskRuleValidation: req.body.taskRuleValidation,
                 taskFinished: req.body.taskFinished,
                 phaseId: req.body.phaseId,
                 position: req.body.position
    };

    Task.findOne(query).exec(function (err, task) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            task = _.extend(task, data);

            task.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(task);
                }
            });
        }
    });
};

/*
 * Delete a task
 */
exports.delete = function (req, res) {
    var query = { _id: req.params.taskId };

    Task.remove(query).exec(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.send({message: 'Task has been removed.'});
        }
    });
};

/*
 * Project authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    var user = req.user;
    var query = { _id: req.params.storyId, projectId: { $in: user.projects } };

    Story.findOne(query).count().exec(function(err, amount) {
        if (err) return next(err);
        if (!amount) return res.status(403).send({
            message: 'User is not authorized'
        });
        next();
    });
};