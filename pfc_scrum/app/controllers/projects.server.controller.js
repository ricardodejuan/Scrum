/**
 * Created by J. Ricardo de Juan Cajide on 9/19/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Project = mongoose.model('Project'),
    User = mongoose.model('User'),
    _ = require('lodash'),
    async = require('async');


/**
 * Create a project
 */
exports.create = function(req, res) {
    var project = new Project(req.body);
    var user = req.user;
    project.users.push(
        {userId: user._id, admin: true, role: "TEAM"}
    );

    project.save(function(err, doc) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            user.projects.push(
                project._id
            );
            user.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(project);
                }
            })
        }
    });
};

/**
 * List of Projects
 */
exports.list = function(req, res) {
    var query = { 'users.userId': req.user._id };
    var projection = { projectName:1 };
    console.log(req.param('a'));
    Project.find(query, projection).limit(10).exec(function(err, articles) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(articles);
        }
    });
};

/**
 * Show the current article
 */
exports.get = function(req, res) {
    res.jsonp(req.project);
};

/**
 * Update a project
 */
exports.update = function(req, res) {
    var project = req.project;
    var body = { projectName: req.body.projectName, descriptionName: req.body.descriptionName };

    project = _.extend(project, body);

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
                var query = { _id: user.userId };
                var doc = { $push: {projects: project._id} };

                User.update(query, doc, function (err) {
                    if (err) {
                        return res.status(400).send({message: err.message});
                    } else if (--usersToGo === 0){
                        res.status(200).send({message: 'Users have been joined to the project'});
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
                    res.status(200).send({message: 'You have been left the project'});
                }
            });
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
    var usersToGo = req.project.users.length;

    async.each(req.project.users, function (doc) {
        if (req.user._id.equals(doc.userId)) {
            next();
        }
        else if (--usersToGo === 0) {
            return res.status(403).send({
                message: 'User is not authorized'
            });
        }
    });
};