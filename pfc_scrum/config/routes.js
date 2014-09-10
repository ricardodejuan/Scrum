/**
 * Created by J. Ricardo de Juan Cajide on 8/26/14.
 */
var index = require('../app/controllers/index');
var userController = require('../app/controllers/userController');

var express = require('express');
var passport = require('passport');

module.exports = function (app) {

    var router = express.Router();

    router.route('/')
        .get(index.indexB);

    router.route('/index')
        .get(index.indexA);

    router.route('/signup')
        .post(userController.signup);

    app.use('/api', router);
};