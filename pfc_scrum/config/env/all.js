/**
 * Created by J. Ricardo de Juan Cajide on 9/10/14.
 */
module.exports = {
    app: {
        title: 'SCRUM.JS',
        description: 'Scrum JavaScript with MongoDB, Express, AngularJS, and Node.js',
        keywords: 'mongodb, express, angularjs, node.js, mongoose, passport'
    },
    port: process.env.PORT || 3000,
    templateEngine: 'swig',
    sessionSecret: 'MEAN',
    sessionCollection: 'sessions'

};