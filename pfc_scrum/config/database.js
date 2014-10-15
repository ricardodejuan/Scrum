/**
 * Created by J. Ricardo de Juan Cajide on 8/19/14.
 */
'use strict';

var mongoose = require('mongoose');

module.exports = function (config) {

    var db = mongoose.connect(config.db, function (err, res) {
        if (err) throw err;
        console.log('Connected to DB');
    });

    return db;
};