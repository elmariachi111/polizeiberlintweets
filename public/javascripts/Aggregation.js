
var Aggregation = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function() {
        this.on("change:district", this.districtChanged.bind(this));
    },
    districtChanged: function() {
        var district = this.changed.district;
        var hashtag = this.id;
        var payload = {
            district: district.name,
            ll: {
                lat:district.ll.lat(), lon:district.ll.lng()
            }
        };
        var that = this;

        $.post("/hashtag/"+hashtag+"/location", payload).done( function (result) {
            that.collection.remove(that);
        });
    }
});

var Aggregations = Backbone.Collection.extend({
    model: Aggregation,
    url: "/aggregations"
});

var AggregationOverview = Backbone.View.extend({
    initialize: function() {

        this.collection = new Aggregations();
        this.listenTo(this.collection, "reset", this.addAll);
        this.listenTo(this.collection, "selected", this.selected);
        this.listenTo(this.collection, "remove", this.remove);
    },
    selected: function(model) {
        this.currentModel = model;
    },
    districtSelected: function(districtInfo) {
        if (this.currentModel) {
            this.currentModel.set("district", districtInfo);
        }
    },
    remove: function(model) {
        this.currentModel = null;
    },
    addAll: function() {
        var that = this;
        var tpl = Handlebars.compile($('#tpl-agg').html());
        this.collection.forEach( function (agg) {
            var aggView = new AggView({collection: that.collection, model: agg, tpl: tpl});
            that.$el.append(aggView.render().$el);
        });
    }
});

var AggView = Backbone.View.extend({
    events: {
        "click": "select"
    },
    tagName: 'li',
    initialize: function(options) {
        this.tpl = options.tpl;
        this.listenTo(this.model, "remove", this.remove);
    },

    select: function() {
        this.$el.toggleClass('active');
        this.model.trigger("selected", this.model);
    },
    render: function() {
        this.$el.html ( this.tpl( this.model.toJSON() ));
        return this;
    }

});


window.AggregationOverview = AggregationOverview;
