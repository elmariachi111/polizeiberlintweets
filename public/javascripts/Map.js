var Map = Backbone.View.extend( {

    initialize:  function() {
        google.maps.event.addDomListener(window, 'load', this.loadMap.bind(this));
    },
    loadMap: function() {
        var mapOptions = {
            center: new google.maps.LatLng(52.54,13.40),
            zoom: 10
        };
        this.gmap = new google.maps.Map(this.el, mapOptions);
        this.gmap.data.setStyle(function(feature) {

            /** @type {google.maps.Data.StyleOptions} */
            var baseFeatureStyle = {
                strokeColor: '#009900',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#00FF00',
                fillOpacity: 0.35
            };

            return baseFeatureStyle;
        });
        var that = this;

        $.get( "/locations").done( function(geojson, state) {
            _.forEach(geojson, function (gj) {
                that.gmap.data.addGeoJson(gj);
            });
            that.bindMapEvents();
        } );

    },
    bindMapEvents: function() {
        var gmap = this.gmap;
        var that = this;
        gmap.data.addListener('mouseover', function(event) {
            gmap.data.revertStyle();
            gmap.data.overrideStyle(event.feature, {fillOpacity: 0.8});

        });
        gmap.data.addListener('mouseout', function(event) {
            gmap.data.revertStyle();
        });

        gmap.data.addListener('click', function(event) {
            that.trigger("selected:district", {name: event.feature.getProperty('Name'), ll: event.latLng})
        });

    }

});

window.Map = Map;
