/**
 * Created by J. Ricardo de Juan Cajide on 8/19/14.
 */
var mongoose = require('mongoose');

module.exports = function (app, config) {

    var db = mongoose.connect(config.db, function (err, res) {
        if (err) throw err;
        console.log('Connected to DB');
    });
    app.set('db', db);

}