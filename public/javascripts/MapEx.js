var Map = Backbone.View.extend( {

    initialize:  function() {

    },
    prepareMap: function() {

        var mapOptions = {
            center: new google.maps.LatLng(52.46,13.68),
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoom: 10
        };
        this.gmap = new google.maps.Map(this.el, mapOptions);
        var that = this;
        this.loadAggregation( function(aggregated) {
            that.loadDistricts(aggregated, function() {
                /** @type {google.maps.Data.StyleOptions} */
                var baseFeatureStyle = {
                    strokeColor: '#681B19',
                    strokeOpacity: 0.7,
                    strokeWeight: 1,
                    fillColor: '#A12E1F',
                    fillOpacity: 0.25
                };
                that.gmap.data.setStyle(function(feature) {
                    var colScale = feature.getProperty('colScale');
                    baseFeatureStyle.fillOpacity = colScale;
                    return baseFeatureStyle;
                });
            });

        });

    },
    loadAggregation: function( callback ) {
        $.get("/aggregations/district").done( function(aggregated) {
            var maxEvts = _.max(aggregated,  function(agg) {
                return agg.eventsPerDistrict
            });
            var minEvts = _.min(aggregated,  function(agg) {
                return agg.eventsPerDistrict
            });
            var ratio = maxEvts.eventsPerDistrict - minEvts.eventsPerDistrict;
            _.forEach(aggregated, function(agg) {
               agg.colScale = 0.2 + (0.7* (agg.eventsPerDistrict - minEvts.eventsPerDistrict) / ratio);
            });
            callback(aggregated);
        } );
    },
    loadDistricts: function(aggregated, callback) {
        var that = this;
        $.get( "/districts").done( function(geojson, state) {
            _.forEach(geojson, function (gj) {
                var agg = _.find(aggregated, function(agg) {
                    return agg._id == gj.properties.Name;
                });

                var feat = that.gmap.data.addGeoJson(gj)[0];
                feat.setProperty('colScale', agg.colScale);
                feat.setProperty('aggregation', agg);

                var bounds = new google.maps.LatLngBounds();
                var geom = feat.getGeometry();
                var pts = geom.getArray()[0].getArray(); //linearRing -> pts

                _.forEach(pts, function(ll) {
                    bounds.extend(ll);
                });
                feat.setProperty("bounds", bounds); //getCenter

            });
            that.bindMapEvents();
            callback(that);
        } );
    },
    setMarker: function(loc) {
        var ll = new google.maps.LatLng(loc.lat, loc.lon);
        this.currentMarker = new google.maps.Marker({
            map: this.gmap,
            draggable:false,
            animation: google.maps.Animation.DROP,
            position: ll
        });
    },
    unsetMarker: function() {
        if (this.currentMarker) {
            this.currentMarker.setMap(null);
        }

    },
    bindMapEvents: function() {
        var gmap = this.gmap;
        var that = this;
        gmap.data.addListener('mouseover', function(event) {
            gmap.data.revertStyle();
            gmap.data.overrideStyle(event.feature, {fillOpacity: 0.9});
            that.trigger("hover:district", event.feature.getProperty("aggregation"));

        });
        gmap.data.addListener('mouseout', function(event) {
            //gmap.data.revertStyle();
        });

        gmap.data.addListener('click', function(event) {
            var center = event.feature.getProperty("bounds").getCenter();
            gmap.panTo( new google.maps.LatLng (center.lat(), center.lng()+0.1) );
            gmap.setZoom(11);
            gmap.data.revertStyle();
            gmap.data.overrideStyle(event.feature, {strokeWeight: 4});
            that.trigger("selected:district", {feature: event.feature, ll: event.latLng})
        });

    }

});