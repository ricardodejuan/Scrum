/**
 * Created by J. Ricardo de Juan Cajide on 8/25/14.
 */
'use strict';

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan'); //log color for dev.
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var methodOverride = require('method-override');
var config = require('./config');
var morgan = require('morgan');
var consolidate = require('consolidate');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var helmet = require('helmet');
var compress = require('compression');



module.exports = function (db) {

    var app = express();

    // Globbing model files
    config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
        require(path.resolve(modelPath));
    });

    // Setting application local variables
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    app.locals.jsFiles = config.getJavaScriptAssets();
    app.locals.cssFiles = config.getCSSAssets();

    // Passing the request url to environment locals
    app.use(function(req, res, next) {
        res.locals.url = req.protocol + '://' + req.headers.host + req.url;
        next();
    });

    // Should be placed before express.static
    app.use(compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // Showing stack errors
    app.set('showStackError', true);

    // Set swig as the template engine
    app.engine('server.view.html', consolidate[config.templateEngine]);

    // view engine setup
    app.set('view engine', 'server.view.html');
    // Specify the views folder
    app.set('views', path.resolve('./app/views'));

    app.use(favicon());
    app.use(logger('dev'));
    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Enable jsonp
    app.enable('jsonp callback');

    // CookieParser should be above session
    app.use(cookieParser());

    // Use express session support since OAuth2orize requires it
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        store: new MongoStore({
            db: db.connection.db,
            collection: config.sessionCollection
        })
    }));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

    // connect flash for flash messages stored in session
    app.use(flash());

    // Use helmet to secure Express headers
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.disable('x-powered-by');

    // Setting the app router and static folder
    app.use(express.static(path.resolve('./public')));

    // Globbing routing files
    config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
        require(path.resolve(routePath))(app);
    });

    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
        // Enable logger (morgan)
        app.use(morgan('dev'));

        // Disable views cache
        app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }

    app.use(function(err, req, res, next) {
        // If the error object doesn't exists
        if (!err) return next();

        // Log it
        console.error(err.stack);

        // Error page
        res.status(500).render('500', {
            error: err.stack
        });
    });

        // Assume 404 since no middleware responded
    app.use(function(req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not Found'
        });
    });

    /*/// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /// error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });*/
    return app;
};