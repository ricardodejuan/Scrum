var debug = require('debug')('pfc_scrum');
var init = require('./config/init')();
var config = require('./config/config');

// Database Connection
var db = require('./config/database')(config);

// Express settings
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port, function() {
    debug('Scrum server listening on port ' + config.port);
});

module.exports = app;