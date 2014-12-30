/**
 * Created by J. Ricardo de Juan Cajide on 12/20/14.
 */
'use strict';

module.exports = {
    db: {
        uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/scrum',
        options: {
            user: '',
            pass: ''
        }
    },
    log: {
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'combined',
        // Stream defaults to process.stdout
        // Uncomment to enable logging to a log on the file system
        options: {
            stream: 'access.log'
        }
    },
    assets: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.min.css',
                'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/angular-xeditable/dist/css/xeditable.css'
            ],
            js: [
                'public/lib/jquery/dist/jquery.min.js',
                'public/lib/jquery-ui/jquery-ui.js',
                'public/lib/angular/angular.js',
                'public/lib/angular-resource/angular-resource.js',
                'public/lib/angular-cookies/angular-cookies.js',
                'public/lib/angular-animate/angular-animate.js',
                'public/lib/angular-touch/angular-touch.js',
                'public/lib/angular-sanitize/angular-sanitize.js',
                'public/lib/angular-ui-router/release/angular-ui-router.js',
                'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/bootstrap/dist/js/bootstrap.min.js',
                'public/lib/angular-socket-io/socket.min.js',
                'public/lib/socket.io-client/socket.io.js',
                'public/lib/angular-xeditable/dist/js/xeditable.js',
                'public/lib/checklist-model/checklist-model.js',
                'public/lib/angular-dragdrop/src/angular-dragdrop.min.js',
                'public/lib/highcharts-ng/dist/highcharts-ng.js',
                'public/lib/highstock/js/highstock.src.js'
            ]
        },
        css: 'public/dist/application.min.css',
        js: 'public/dist/application.min.js'
    },
    mailer: {
        from: process.env.MAILER_FROM || 'MAILER_FROM',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
            auth: {
                user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
                pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
            }
        }
    }
};