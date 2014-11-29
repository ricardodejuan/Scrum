/**
 * Created by J. Ricardo de Juan Cajide on 11/29/14.
 */
'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Project = mongoose.model('Project'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, project;

/**
 * Article routes tests
 */
describe('Project CRUD tests', function() {
    beforeEach(function(done) {
        // Create user credentials
        credentials = {
            username: 'username',
            password: 'password'
        };

        // Create a new user
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: credentials.username,
            password: credentials.password
        });

        // Save a user to the test db and create new article
        user.save(function() {
            project = {
                projectName: 'Project Name',
                startTime: new Date(),
                endTime: new Date()
            };

            done();
        });
    });

    it('should be able to save an article if logged in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new article
                agent.post('/projects')
                    .send(project)
                    .expect(201)
                    .end(function(projectSaveErr, projectSaveRes) {
                        // Handle article save error
                        if (projectSaveErr) done(projectSaveErr);

                        // Get a list of articles
                        agent.get('/projects')
                            .end(function(projectsGetErr, projectsGetRes) {
                                // Handle article save error
                                if (projectsGetErr) done(projectsGetErr);

                                // Get articles list
                                var projects = projectsGetRes.body;

                                // Set assertions
                                (projects[0].projectName).should.match('Project Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save an project if not logged in', function(done) {
        agent.post('/projects')
            .send(project)
            .expect(401)
            .end(function(projectSaveErr, projectSaveRes) {
                // Call the assertion callback
                done(projectSaveErr);
            });
    });

    it('should not be able to save an article if no title is provided', function(done) {
        // Invalidate title field
        project.projectName = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new project
                agent.post('/projects')
                    .send(project)
                    .expect(400)
                    .end(function(projectSaveErr, projectSaveRes) {
                        // Set message assertion
                        (projectSaveRes.body.message).should.match('Title is required');

                        // Handle article save error
                        done(projectSaveErr);
                    });
            });
    });

    it('should be able to update an project if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Get the userId
                var userId = user.id;

                // Save a new project
                agent.post('/projects')
                    .send(project)
                    .expect(201)
                    .end(function(projectSaveErr, projectSaveRes) {
                        // Handle article save error
                        if (projectSaveErr) done(projectSaveErr);

                        // Update article title
                        project.projectName = 'NEW TITLE';

                        // Update an existing article
                        agent.put('/projects/' + projectSaveRes.body._id)
                            .send(project)
                            .expect(200)
                            .end(function(projectUpdateErr, projectUpdateRes) {
                                // Handle article update error
                                if (projectUpdateErr) done(projectUpdateErr);

                                // Set assertions
                                (projectUpdateRes.body._id).should.equal(projectSaveRes.body._id);
                                (projectUpdateRes.body.projectName).should.match('NEW TITLE');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    afterEach(function(done) {
        User.remove().exec();
        Project.remove().exec();
        done();
    });
});