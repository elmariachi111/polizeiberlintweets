### Polizei Berlin Tweets

The police department of Berlin decided in early June 2014 to tweet every single event that happened in 24 hours.
I created this project over a weekend to display their tweets [@PolizeiBerlin_E](https://twitter.com/PolizeiBerlin_E) on a
Google Map. You can view the results at http://polizeiberlintweets.herokuapp.com. I would like to point out that
this project is a mere fun effort: for professional usage it should at least be transformed to use require.js for
dependency management and grunt for automated LESS parsing and bower updates. Currently you have to generate
CSS files on your own (lessc) and update frontend dependencies on your own as well (bower install).

I wrote this project from scratch but made use of a fair amount of existing libraries. It mostly is written
in Javascript (using nodejs as a backend and Backbone.js at the front)

There are three important parts in this application:
1) the scraper that gets all tweets by one account on Twitter ( /scrape.js ) is a fairly simple script that
I simply called several times to retrieve tweets by the [REST API](https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline)
and store it into MongoDB.

2) the location moderation script (/public/javascripts/Map.js and Aggregation.js, /public/locations.html) is a
simple map display that allows us to match a non-located hashtag ("#Gatow") with a real location. Locations are
manually matched against a database of Berlin's districts in GeoJSON format (I used those: https://github.com/m-hoerz/berlin-shapes).

3) the frontend script that you see on the website (/public/index.html, /javascripts/Infobox, MapEx).

### What can I do with it?
Whatever you want. However, I don't think that I'm going to maintain this project anymore. If you've got questions
or need help adapting something from this project feel free to ask me anything, anytime.

###License

                    DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004
                    Copyright (C) 2014 Stefan Adolf <stadolf@gmail.com>

                    Everyone is permitted to copy and distribute verbatim or modified
                    copies of this software, and changing it is allowed as long
                    as the name is changed.

                    DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

                    0. You just DO WHAT THE FUCK YOU WANT TO.
