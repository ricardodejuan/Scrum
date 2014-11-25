/**
 * Created by J. Ricardo de Juan Cajide on 11/24/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    DailyScrum = mongoose.model('DailyScrum'),
    Sprint = mongoose.model('Sprint'),
    _ = require('lodash');


/**
 * Create a DailyScrum
 */
exports.create = function(req, res) {
    var data = { did: req.body.did,
                 willDo: req.body.willDo,
                 impediments: req.body.impediments,
                 date: req.body.date,
                 sprintId: req.params.sprintId,
                 userId: req.user._id
    };
    var dailyScrum = new DailyScrum(data);

    dailyScrum.save(function(err, doc) {
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
 * List of DailyScrum
 */
exports.list = function(req, res) {
    var query = { 'sprintId': req.params.sprintId };
    var pop = ({ path: 'userId', select: 'username' });

    DailyScrum.find(query).populate(pop).exec(function(err, dailies) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(dailies);
        }
    });
};


/*
 * Load a DailyScrum
 */
exports.load = function (req, res) {
    var query = { _id: req.params.dailyId };

    DailyScrum.findOne(query).exec(function (err, dailyScrum) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(dailyScrum);
        }
    });
};

/*
 * Update a DailyScrum
 */
exports.update = function (req, res) {
    var query = { _id: req.params.dailyId };
    var data = { did: req.body.did,
                 willDo: req.body.willDo,
                 impediments: req.body.impediments,
                 date: req.body.date
    };

    DailyScrum.findOne(query).exec(function (err, dailyScrum) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            dailyScrum = _.extend(dailyScrum, data);

            dailyScrum.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(dailyScrum);
                }
            });
        }
    });
};

/*
 * Delete a DailyScrum
 */
exports.delete = function (req, res) {
    var query = { _id: req.params.dailyId };

    DailyScrum.remove(query).exec(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.send({message: 'DailyScrum has been removed.'});
        }
    });
};

/*
 * Project authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    var user = req.user;
    var query = { _id: req.params.sprintId, projectId: { $in: user.projects } };

    Sprint.findOne(query).count().exec(function(err, amount) {
        if (err) return next(err);
        if (!amount) return res.status(403).send({
            message: 'User is not authorized'
        });
        next();
    });
};