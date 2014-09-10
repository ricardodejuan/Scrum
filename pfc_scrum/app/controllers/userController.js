/**
 * Created by J. Ricardo de Juan Cajide on 8/20/14.
 */
var validator = require('validator');
var async = require('async');

var User = require('../models/user');

module.exports = {

    signup : function (req, res) {

        if (!req.body.username)
        {
            return res.status(400).json({ error: 'Username is required' });
        }

        if (!req.body.first_name)
        {
            return res.status(400).json({ error: 'First name is required' });
        }

        if (!req.body.last_name)
        {
            return res.status(400).json({ error: 'Last name is required' });
        }

        if (!req.body.password)
        {
            return res.status(400).json({ error: 'Password is required' });
        }

        if (!req.body.email)
        {
            return res.status(400).json({ error: 'Email is required' });
        }

        if (!validator.isEmail(req.body.email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        /*User.existUsername(req.body.username, function (err, count) {
            if (err || count) {
                console.log('1');
            }
        });

        User.existEmail(req.body.email, function (err, count) {
            if (err || count) {
                console.log('2');
            }
        });*/

        var usr = { username: req.body.username, first_name: req.body.first_name, last_name: req.body.last_name,
                    email: req.body.email, password: req.body.password };

        var user = new User(usr);
        user.save(function (err, saved) {
            if (err) {
                res.status(400).json({error: err});
            }
            else {
                res.status(201).json(saved);
            }
        });

        return res;
    },

    login : function (req, res) {
    }

};