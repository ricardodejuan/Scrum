/**
 * Created by J. Ricardo de Juan Cajide on 9/10/14.
 */
'use strict';

var passport = require('passport');

module.exports = function(app) {
    // Root routing
    var core = require('../../app/controllers/core');
    app.route('/').get(core.index);
};