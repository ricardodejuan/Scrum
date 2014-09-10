/**
 * Created by J. Ricardo de Juan Cajide on 9/10/14.
 */
'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
    res.render('index', {
        user: req.user || null
    });
};
