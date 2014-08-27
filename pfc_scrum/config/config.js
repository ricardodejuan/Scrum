/**
 * Created by J. Ricardo de Juan Cajide on 8/26/14.
 */
var path = require('path');
var root = path.resolve(__dirname + '../..');

module.exports = {
    development: {
        root: root,
        db: 'mongodb://localhost/scrum'
    },
    test: {
        root: root,
        db: 'mongodb://localhost/scrumtest'
    },
    production: {
        root: root,
        db: process.env.MONGOHQ_URL
    }
}