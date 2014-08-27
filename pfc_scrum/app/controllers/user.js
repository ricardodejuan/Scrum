/**
 * Created by J. Ricardo de Juan Cajide on 8/20/14.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Message = require('../models/message');

// middleware to use for all request
router.use(function (req, res, next) {
    //do something
    console.log('Something is happening');
    next();
});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/a', function(req, res) {
    /*  var record = new User({"name":"g","surname":"a","mail":"f"});
     record.save(function (err) {
     if (err) console.log(err);
     else res.json({status:'success'});
     });*/
    /*var r1 = new Message({"name":"m122","subject":"s1"});
     r1.save(function (err) {
     if (err) console.log(err);
     else res.json({status:'success'});
     })*/
    Message.find(function (err, messages) {
        res.send(messages);
    });
});

module.exports = router;