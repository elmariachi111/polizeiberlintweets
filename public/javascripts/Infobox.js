(function() {

    var Tweet = Backbone.Model.extend({
        parse: function(json) {
            json.created = new Date(json.created);
            return json;
        }
    });

    var Tweets = Backbone.Collection.extend({
        model: Tweet,
        url: function() {
            return "/district/" + this.district + "/tweets";
        }
    });

    var TweetView = Backbone.View.extend( {
        tagName: 'div',
        className: 'tweet',
        initialize: function() {

        },
        render: function() {
            var json = this.model.toJSON();
            this.$el.html(this.tpl(json));
            return this;
        }
    });



    var HashtagView = Backbone.View.extend({
        tagName: 'li',
        classNames: 'hashtag',
        events: {
          "click": "selected"
        },
        initialize: function() {
          var that = this;
          this.collection.on("selected", function(model) {
              if (that.model == model)
                that.$el.addClass("active");
              else
                that.$el.removeClass("active");
          })
        },
        render: function() {
            var html = '#' + this.model.get('tag');
            this.$el.html(html);
            return this;
        },
        selected: function(e) {
            e.preventDefault();
            this.collection.trigger("selected", this.model);
        }
    });


    window.Infobox = Backbone.View.extend({
        initialize: function() {
            this.collection = new Tweets;

            this.listenTo(this.collection, "reset", this.renderTweets);
            this.$content = this.$('.content');

        },

        showDistrict: function(evt) {
            this.$content.html('');

            var agg = evt.feature.getProperty("aggregation");
            var hashtags = new Backbone.Collection(agg.geos);
            var $htUl = $('<ul class="hashtags"></ul>')
            hashtags.forEach( function (ht) {
                var tagView = new HashtagView({model: ht, collection: hashtags});
                $htUl.append( tagView.render().$el);
            });
            this.listenTo(hashtags, "selected", this.showRegion);

            this.$content.append('<h2>'+agg._id+'</h2>')
            this.$content.append($htUl);
            this.collection.district = agg._id;
            this.collection.fetch({reset:true});

            //this.collection.district = agg.district;

        },
        renderTweets: function(tweets) {
            var $tweetDiv = $('<div id="tweets"></div>');

            var that = this;
            this.collection.forEach( function (tweet) {
                var tweetView = new TweetView({
                    model: tweet, collection: that.tweets
                })
                $tweetDiv.append( tweetView.render().$el);
            });
            this.$content.append($tweetDiv);
            var ctop = $tweetDiv.position().top;
            var containerHeight = $('.content').height();
            $tweetDiv.css({height:containerHeight-ctop + 15});
        },
        showRegion: function(hashtag) {

        }
    });

    window.TweetView = TweetView;
})();
