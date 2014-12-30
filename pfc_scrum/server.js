'use strict';

var init = require('./config/init')();
var config = require('./config/config');
var chalk = require('chalk');

// Database Connection
var db = require('./config/database')(config);

// Express settings
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Socket.io settings
require('./config/socketio')(app);

// Start the app by listening on <port>
if (process.env.NODE_ENV === 'secure') {
    app.listen(config.port);
} else {
    app.get('server').listen(config.port);
}

// Expose app
module.exports = app;

// Logging initialization
console.log('--');
console.log(chalk.green(config.app.title + ' application started'));
console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
console.log(chalk.green('Port:\t\t\t\t' + config.port));
console.log(chalk.green('Database:\t\t\t' + config.db.uri));
if (process.env.NODE_ENV === 'secure') {
    console.log(chalk.green('HTTPs:\t\t\t\ton'));
}
console.log('--');