/**
 * Created by J. Ricardo de Juan Cajide on 9/10/14.
 */
module.exports = {
    app: {
        title: 'SCRUM.JS',
        description: 'Scrum JavaScript with MongoDB, Express, AngularJS, and Node.js',
        keywords: 'mongodb, express, angularjs, node.js, mongoose, passport'
    },
    port: process.env.PORT || 3000,
    templateEngine: 'swig',
    sessionSecret: 'SCRUM',
    sessionCollection: 'sessions',
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
        css: [
            'public/modules/**/css/*.css'
        ],
        js: [
            'public/config.js',
            'public/application.js',
            'public/modules/*/*.js',
            'public/modules/*/*[!tests]*/*.js'
        ],
        tests: [
            'public/lib/angular-mocks/angular-mocks.js',
            'public/modules/*/tests/*.js'
        ]
    }

};