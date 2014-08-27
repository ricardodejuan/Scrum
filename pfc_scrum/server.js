var debug = require('debug')('pfc_scrum');
var express = require('express');
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

var app = express();

var expressConf = require('./config/express');
var db = require('./config/database');
var routeRESTAPI = require('./config/routes');

// Dynamically include routes (Controller)
/*fs.readdirSync(path.join(__dirname, 'app/controllers')).forEach(function (filename) {
    if(filename.indexOf('.js')) {
        route = require(path.join(__dirname, 'app/controllers/' + filename));
        route.controller(app);
    }
});*/

// Express settings
expressConf(app, config);

// Database Connection
db(app, config);

// Routes
routeRESTAPI(app);

// Start the app by listening on <port>
var port = process.env.PORT || 3000;
app.set('port', port);
app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + port);
});

module.exports = app;