/**
 * Created by J. Ricardo de Juan Cajide on 9/10/14.
 */
module.exports = {
    db: 'mongodb://localhost/scrum',
    app: {
        title: 'SCRUM.JS - Development Environment'
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