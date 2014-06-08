var express = require('express'),
    Mongo = require('../mongo.js');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

router.get('/locations', function(req,res) {
    Mongo.collection('locations').find({}).toArray( function(err, locs) {
        res.json(locs);
    })
});

router.post('hashtag/location', function(req,res) {

});

module.exports = router;
