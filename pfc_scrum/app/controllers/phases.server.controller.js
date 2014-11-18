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
    Phase = mongoose.model('Phase'),
    _ = require('lodash');


/**
 * Create a phase
 */
exports.create = function(req, res) {
    var data = { phaseName: req.body.phaseName,
                 position: req.body.position,
                 sprintId: req.params.sprintId
               };
    var phase = new Phase(data);

    phase.save(function(err, doc) {
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
 * List of phases
 */
exports.list = function(req, res) {
    var query = { 'sprintId': req.params.sprintId };

    Phase.find(query).exec(function(err, phases) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(phases);
        }
    });
};

/*
 * Load a Phase
 */
exports.load = function (req, res) {
    var query = { _id: req.params.phaseId };

    Phase.findOne(query).exec(function (err, phase) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(phase);
        }
    });
};

/*
 * Update a Phase
 */
exports.update = function (req, res) {
    var query = { _id: req.params.phaseId };
    var data = { phaseName: req.body.phaseName,
                 position: req.body.position
               };

    Phase.findOne(query).exec(function (err, phase) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            phase = _.extend(phase, data);

            phase.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(phase);
                }
            });
        }
    });
};

/*
 * Delete a Sprint
 */
exports.delete = function (req, res) {
    var query = { _id: req.params.phaseId };

    Phase.remove(query).exec(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.send({message: 'Phase has been removed.'});
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