return false;

var Mongo = require('../mongo.js'),
    und = require('underscore')
;

Mongo.collection('policecrawl').find({"entities.hashtags.district":{$exists:1} }).toArray( function(err, res ) {
    und.forEach(res, function(r) {
       var hashtag = und.find(r.entities.hashtags, function(ht) {
           return (ht.district !== undefined)
       });
       if (hashtag) {
           r.district = hashtag.district;
           r.customgeo = hashtag.loc;
           hashtag.district = null;
           hashtag.loc = null;
           Mongo.collection("policecrawl").save(r, {w:1}, function(err,cnt) {
               console.dir(cnt);
           });
       }


    });
});