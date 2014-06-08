var Map = function() {
    this.apiHost = 'http://localhost:3000'
}

Map.prototype = {
    initialize:  function(elId) {
        var mapOptions = {
            center: new google.maps.LatLng(52.54,13.40),
            zoom: 10
        };
        this.gmap = new google.maps.Map(document.getElementById(elId), mapOptions);
        this.loadDistricts();

    },
    loadDistricts: function() {
        var that = this;

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

        $.get( this.apiHost + "/locations").done( function(geojson, state) {
            _.forEach(geojson, function (gj) {
                that.gmap.data.addGeoJson(gj);
            });
            that.gmap.data.addListener('mouseover', function(event) {
                that.gmap.data.revertStyle();
                that.gmap.data.overrideStyle(event.feature, {fillOpacity: 0.8});

            });
            that.gmap.data.addListener('click', function(event) {
                var feature = event.feature;
                var name = feature.getProperty('Name');
                alert(name);
            });
            that.gmap.data.addListener('mouseout', function(event) {
                that.gmap.data.revertStyle();
            });
        } );


        //zoom(map);
    }
}

window.Map = Map;
