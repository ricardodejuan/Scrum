/**
 * Created by J. Ricardo de Juan Cajide on 8/26/14.
 */
var index = require('../app/controllers/index');

module.exports = function (app) {

//    app.use('/', index)(app);

    app.get('/', index.indexA);
}