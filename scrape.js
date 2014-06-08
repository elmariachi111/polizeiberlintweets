var util = require('util'),
    Request = require('request'),
    Mongo = require('./mongo.js'),
    und = require('underscore')
;
//http://www.berlin.de/polizei/polizeimeldungen/
//http://polizeinewsberlin.de/
//https://www.facebook.com/polizeinewsberlin
//http://www.berlinonline.de/nachrichten/mitte?filter%5Bcategory%5D=polizeimeldungen

var twBase = "https://api.twitter.com/1.1";
//var endpoint = "/search/tweets.json";
var endpoint= "/statuses/user_timeline.json";
//berlinpolice

var col = Mongo.collection('policecrawl');

console.log("already scraped");
return false;

var saveTweets = function(err, tweets) {

    und.forEach( tweets, function(st) {
        st._id = st.id_str;
        st.type="tweet";

        col.save(st, function(err) {

        });
    });
}

var getTweets = function(screenName, callback) {

    var ret = Request.get({

            uri: twBase + endpoint,
            qs: {
                screen_name: screenName,
                count: 100,
                max_id: '447373672203165698',
                'include_rts': false
                //'result_type': 'recent'

            },
            json:true,
            auth: { 'bearer': process.env.TWITTER_ACCESSTOKEN }
        },
        function (error, response, body) {

            if (!error && response.statusCode == 200) {
                callback(null, body);
            } else {
                console.log("q"+error);
            }

        }
    );

}

getTweets('PolizeiBerlin_E', saveTweets);

console.log("Hmm");