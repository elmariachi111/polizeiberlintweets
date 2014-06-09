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

router.get('/districts', function(req,res) {
    Mongo.collection('locations').find({}).toArray( function(err, locs) {
        res.json(locs);
    })
});

router.get('/district/:district/tweets', function(req,res) {
    var d = req.params.district;

    Mongo.collection('policecrawl').find({created: {$gte: new Date("2014-05-30")},"entities.hashtags.district":d}).sort({"created":1}).toArray(function(err, tweets) {
        res.json(tweets);
    })
});

//all hashtags aggregated
router.get('/aggregations', function(req, res){
   Mongo.collection('policecrawl').aggregate( [
       {$match: {created:{$gte: new Date('2014-06-01')}} },
       {$project:{
           text:1,
           entities:1,
           retweet_count:1,
           favorite_count:1
       }
       },
       {$unwind:"$entities.hashtags"},
       {$group: {_id: '$entities.hashtags.text', eventsPerHashtag: {$sum:  1} } },
       {$sort: { eventsPerHashtag: -1 } }
   ], function(err, agg) {
       res.json(agg);
   });
});

//all districts aggregated
router.get('/aggregations/district', function(req, res){
    Mongo.collection('policecrawl').aggregate( [
        {$match: {created:{$gte: new Date('2014-06-01')}} },
        {$project:{
            text:1,
            entities:1,
            retweet_count:1,
            favorite_count:1,
            district:1,
            customgeo:1
        }
        },
        {$unwind:'$entities.hashtags'},
        {$match: {"entities.hashtags.district":{ $exists: 1}} },
        {$group: {_id: '$entities.hashtags.district',
            eventsPerDistrict: {$sum:  1},
            geos: {
                $addToSet:{ tag:"$entities.hashtags.text", loc:"$entities.hashtags.loc" }
            }
        }
        },
        {$sort: { eventsPerHashtag: -1 } }
    ], function(err, agg) {
        res.json(agg);
    });
});

router.route('/hashtag/:hashtag/location').post( function(req,res) {
    var hashtag = req.params.hashtag;
    var location = {lat: parseFloat(req.body.ll.lat), lon: parseFloat(req.body.ll.lon) };
    var district = req.body.district;

    /*Mongo.collection("hashtags").save({_id:hashtag,location:location, district:district},{w:1}, function(err, cnt) {
        if (err) {
            res.json(500, {err: err} );
        } else {
            res.json({updated: cnt});
        }
    });*/

    Mongo.collection("policecrawl").update(
        {"entities.hashtags.text":hashtag},
        {$set: {"entities.hashtags.$.loc": location, "entities.hashtags.$.district": district} },
        {multi:true}, function(err, cnt) {
            if (err) {
                res.json(500, {err: err} );
            } else {
                res.json({updated: cnt});
            }
    });
});


module.exports = router;
