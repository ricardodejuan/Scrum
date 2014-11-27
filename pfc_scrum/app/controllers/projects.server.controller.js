/**
 * Created by J. Ricardo de Juan Cajide on 9/19/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Project = mongoose.model('Project'),
    User = mongoose.model('User'),
    _ = require('lodash');


/**
 * Create a project
 */
exports.create = function(req, res) {
    var data = { projectName: req.body.projectName,
        descriptionName: req.body.descriptionName,
        startTime: req.body.startTime,
        endTime: req.body.endTime
    };
    var project = new Project(data);
    var user = req.user;

    project.users.push(
        { userId: user._id, admin: true, role: 'TEAM' }
    );

    project.save(function(err, doc) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            user.projects.push(
                doc._id
            );
            user.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.status(201).jsonp(doc);
                }
            });
        }
    });
};

/**
 * List of Projects
 */
exports.list = function(req, res) {
    var query = { 'users.userId': req.user._id };
    var projection = { projectName: 1 };

    Project.find(query, projection).exec(function(err, projects) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(projects);
        }
    });
};

/**
 * Show the current article
 */
exports.load = function(req, res) {
    res.jsonp(req.project);
};

/**
 * Update a project
 */
exports.update = function(req, res) {
    var project = req.project;
    var data = { projectName: req.body.projectName,
                 descriptionName: req.body.descriptionName,
                 startTime: req.body.startTime,
                 endTime: req.body.endTime,
                 projectBurnDownChart: req.body.projectBurnDownChart
    };

    project = _.extend(project, data);

    project.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(project);
        }
    });
};

/*
 * Join to a project
 */
exports.join = function (req, res) {
    var project = req.project;
    var users = req.body.users;
    var usersToGo = users.length;

    project.addUsers(users, function (err) {
        if (err) {
            return res.status(400).send({message: err.message});
        } else {
            _.forEach(users, function (user) {
                var query = { _id: user._id };
                var doc = { $addToSet: {projects: project._id} };

                User.update(query, doc, function (err) {
                    if (err) {
                        return res.status(400).send({message: err.message});
                    } else if (!err && --usersToGo === 0){
                        res.send({message: 'Users have been joined to the project'});
                    }
                });
            });
        }
    });

};

/*
 * Leave a project
 */
exports.leave = function (req, res) {
    var project = req.project;
    var user = req.user;

    project.deleteUser(user._id, function (err) {
        if (err) {
            return res.status(400).send({message: err.message});
        } else {
            user.deleteProject(project._id, function (err) {
                if (err) {
                    return res.status(400).send({message: err.message});
                } else {
                    res.send({message: 'You have been left the project'});
                }
            });
        }
    });
};

/**
 * Members of a project
 */
exports.members = function (req, res) {
    var query = { 'projects': req.project._id };
    var projection = { username: 1, displayName: 1 };

    User.find(query, projection).exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};


/**
 * Members of a project
 */
exports.nonmembers = function (req, res) {
    var query = { 'projects': { $ne: req.project._id }, 'username': { $regex: req.params.username, $options: '$i' } };
    var projection = { username: 1, displayName: 1 };

    User.find(query, projection).exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};


/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) {
    var query = { '_id': id };

    Project.findOne(query).exec(function(err, project) {
        if (err) return next(err);
        if (!project) return next(new Error('Failed to load project ' + id));
        req.project = project;
        next();
    });
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    var user = req.user;
    var index = _.findIndex(req.project.users, { 'userId': user._id });

    if (index !== -1) {
        next();
    } else {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
};