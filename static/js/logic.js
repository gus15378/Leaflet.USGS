url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

d3.json(url).then(function(data) {
    createFeatures(data.features)
});

function circleRadius(feature) {
    return feature.properties.mag * 2;
  }
  
function circleColor(depth) {

    return depth <= 5 ?  "#EBEDEF":
            depth <= 10 ? "#D6DBDF":
            depth <= 15 ? "#85929E":
            depth <= 20 ? "#5D6D7E":
            depth <= 30 ? "#34495E":
                          "#2E4053";
  }

function createFeatures(earthquakes) {
    function circle(feature, latlng){
        var markers = {
            radius: circleRadius(feature),
            fillColor: circleColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.8
    };
    return L.circleMarker(latlng, markers);
}

  function onEachFeature(feature, layer) {
    layer.bindPopup(
        "<h3>Location: " + feature.properties.place + "<h3> Magnitude: " + 
        feature.properties.mag +"<h3>Depth: " + feature.geometry.coordinates[2] + 
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
}

  var earthquakes = L.geoJSON(earthquakes, {
    pointToLayer: circle,
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
  
}

function createMap(earthQuakes) {

    console.log("createMap has been called!")

    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    var baseMaps = {
      "Street Map": streetmap
    };
  
    var overlayMaps = {
      "Earthquakes": earthQuakes
    };
  
    var map = L.map("map", {

      center: [40.052235, -110.243683],
      zoom: 4.5,

      layers: [streetmap, earthQuakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    var legend = L.control({
        position: 'bottomright'
      });
      legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend'),
          categories = [-10, 5, 10, 15, 20, 30],
          labels = [],
          from, to;
        for (var i = 0; i < categories.length; i++) {
          from = categories[i];
          to = categories[i + 1];
          labels.push(
            '<i style="background:' + circleColor(from + 1) + '">  .  .  </i> ' +
            from + (to ? '&ndash;' + to : '+'));
        }
        div.innerHTML = labels.join('<br>');
        return div;
      };
      legend.addTo(map);
    
  }