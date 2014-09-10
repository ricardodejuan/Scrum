/**
 * Created by J. Ricardo de Juan Cajide on 8/26/14.
 */
//var express = require('express');
//var router = express.Router();

/* GET home page. */
/*router.route('/')

    .get(function(req, res) {
        res.render('index', { title: 'Express' });
    });
*/
module.exports = {

    indexA : function (req, res) {
        return res.render('index', { title: 'Express DASHBOARD' });
    },

    indexB : function (req, res) {
        return res.render('index', { title: 'Express SIGNUP' });
    }
};