/**
 * Created by J. Ricardo de Juan Cajide on 8/19/14.
 */
'use strict';

var mongoose = require('mongoose');
var chalk = require('chalk');

module.exports = function (config) {
    var db = mongoose.connect(config.db.uri, function (err, res) {
        if (err) {
            console.error(chalk.red('Could not connect to MongoDB!'));
            console.log(chalk.red(err));
        }
    });

    mongoose.connection.on('error', function(err) {
            console.error(chalk.red('MongoDB connection error: ' + err));
            process.exit(-1);
        }
    );

    return db;
};