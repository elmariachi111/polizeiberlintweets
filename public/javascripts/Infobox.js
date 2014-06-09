(function() {

    var Tweet = Backbone.Model.extend({
        parse: function(json) {
            json.created = new Date(json.created);
            return json;
        },
        hasTag: function(tag) {
            var ent = this.get('entities');
            var hashtags = ent.hashtags;
            var myTags =  _.pluck(hashtags, "text");
            return _.contains(myTags, tag);

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
        },
        filter: function(hashtag) {
            var ht = hashtag.get('tag');

            if (!this.model.hasTag(ht)) {
                this.$el.addClass("hidden");
            } else {
                this.$el.removeClass("hidden");
            }

        },
        show: function() {
            this.$el.removeClass("hidden");
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
          this.collection.on("selected unselected", function(model) {
              if (that.model == model) {
                  if (that.$el.hasClass("active")) {
                      that.$el.removeClass("active");
                  } else {
                      that.$el.addClass("active");
                  }
              } else {
                  that.$el.removeClass("active");
              }
          });

        },
        render: function() {
            var html = '#' + this.model.get('tag');
            this.$el.html(html);
            return this;
        },
        selected: function(e) {
            e.preventDefault();
            if (this.$el.hasClass("active")) {
                this.collection.trigger("unselected",  this.model);
            } else {
                this.collection.trigger("selected",  this.model);
            }

        }
    });


    window.Infobox = Backbone.View.extend({
        initialize: function() {
            this.collection = new Tweets;
            this.hashtags = null;
            this.listenTo(this.collection, "reset", this.renderTweets);

            this.$content = this.$('.content');

        },

        showDistrict: function(evt) {
            this.$content.html('');
            this.trigger("marker:unset");
            var agg = evt.feature.getProperty("aggregation");
            this.hashtags = new Backbone.Collection(agg.geos);
            var $htUl = $('<ul class="hashtags"></ul>')
            var that = this;
            this.hashtags.forEach( function (ht) {
                var tagView = new HashtagView({model: ht, collection: that.hashtags});
                $htUl.append( tagView.render().$el);
            });

            this.listenTo(this.hashtags, "selected", this.showRegion);
            this.listenTo(this.hashtags, "unselected", function() {
                that.trigger("marker:unset");
            });
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
                });
                tweetView.listenTo(that.hashtags,"selected", tweetView.filter);
                tweetView.listenTo(that.hashtags,"unselected", tweetView.show);
                $tweetDiv.append( tweetView.render().$el);
            });
            this.$content.append($tweetDiv);
            var ctop = $tweetDiv.position().top;
            var containerHeight = $('.content').height();
            $tweetDiv.css({height:containerHeight-ctop + 15});
        },
        showRegion: function(hashtag) {
            this.trigger("marker:unset");
            this.trigger("marker:set", hashtag.get('loc'))
            this.collection.trigger("filter", hashtag);
        }
    });

    window.TweetView = TweetView;
})();
