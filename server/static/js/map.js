// TODO (agonzalezro): organize this code and add some proper style

var apiKey = "AkDUD0VvGiZnEYgXMzPgz0gbUG9KVSAVGMDHLeeVjCM1pbe-a7FCX4lkEMNJmdHZ";
map = new OpenLayers.Map("mapdiv");


var road = new OpenLayers.Layer.Bing({
  key: apiKey,
  type: "Road"
});


// Bing's Aerial imagerySet
var aerial = new OpenLayers.Layer.Bing({
  key: apiKey,
  type: "Aerial"
});


// Bing's AerialWithLabels imagerySet
var hybrid = new OpenLayers.Layer.Bing({
  key: apiKey,
  type: "AerialWithLabels",
  name: "Bing Aerial With Labels"
});


map.addLayers([road, aerial, hybrid]);


epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //oGS 1984 projection
projectTo = map.getProjectionObject(); //The map projection (Spherical Mercator)


function getLocation(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }else{
    //Nothing to do the browser doesn't support geolocation
    return null;
  }
}


var userPosition = null;


function showPosition(position) {
  var lonLat = new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude).transform(epsg4326, projectTo);
  var zoom=12;
  userPosition = position;
  map.setCenter (lonLat, zoom);
  add_circle(position,1);
}


getLocation();


var vectorLayer = new OpenLayers.Layer.Vector("Overlay");


function createPoint(stationData){
  var feature = new OpenLayers.Feature.Vector(
    new OpenLayers.Geometry.Point(stationData.longitude,stationData.latitude).transform(epsg4326, projectTo),
    stationData,
    {externalGraphic: '/static/img/police.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
  );
  vectorLayer.addFeatures(feature);

  //Add a selector control to the vectorLayer with popup functions
  var controls = {
    selector: new OpenLayers.Control.SelectFeature(vectorLayer, {onSelect: createPopup, onUnselect: destroyPopup})
  };

  function createPopup(feature) {
    var name = feature.attributes.name;
    var phone = feature.attributes.telephone;
    var email = feature.attributes.email;
    var twitter = feature.attributes.twitter;

    var message = '<div class="markerContent">';
    message += '<strong>' + name + '</strong><br>';

    if (twitter)
      message += '<a href="https://twitter.com/' + twitter + '">Follow us on twitter!</a><br>';

    if (email && phone) {
      message += 'You can <a href="mailto://"' + email + '">send me an email</a> ';
      message += 'or you just can <a href="#" onclick="call(\'' + phone + '\');">call me</a> (maybe)!</a>';
    } else if (email)
      message += '<a href="mailto://"' + email + '">Send me an email!</a>';
    else if (phone)
      message += '<a href="#" onclick="call(\'' + phone + '\');">Give me a call!</a>';
    else
      message += "Sorry, I don't have phone or email for this station :(";
    message += '</div>',

    feature.popup = new OpenLayers.Popup.FramedCloud("pop",
      feature.geometry.getBounds().getCenterLonLat(),
      null,
      message,
      null,
      true,
      function() { controls['selector'].unselectAll(); }
    );
    feature.popup.closeOnMove = true;
    map.addPopup(feature.popup);
  }

  function destroyPopup(feature) {
    feature.popup.destroy();
    feature.popup = null;
  }

  map.addControl(controls['selector']);
  controls['selector'].activate();

}


map.addLayer(vectorLayer);


var circleLayer = new OpenLayers.Layer.Vector("Overlay");
function add_circle(position, km) {
  circleLayer.destroyFeatures();
  var point = new OpenLayers.Geometry.Point(position.coords.longitude, position.coords.latitude).transform(epsg4326, projectTo);
  var mycircle = OpenLayers.Geometry.Polygon.createRegularPolygon
  (
    point,
    km*1000,
    40,
    0
  );

  var featurecircle = new OpenLayers.Feature.Vector(mycircle);
  circleLayer.addFeatures(featurecircle);
  map.addLayer(circleLayer);
}


var moveToLatLon = function(latitude, longitude) {
  // Set a new map center
  var lonLat = new OpenLayers.LonLat(longitude, latitude).transform(epsg4326, projectTo);
  map.setCenter(lonLat, 12);
}


$(function onReady() {
  var changeMapHeight = function() {
    $('#mapdiv').css('height', $(window).height() - 40);  // 40px is the bootstrap bar size
    map.updateSize();
  }

  $(window).resize(changeMapHeight);
  changeMapHeight();
});
/*
var vectorLayer = new OpenLayers.Layer.Vector("Overlay");

// Define markers as "features" of the vector layer:
var feature = new OpenLayers.Feature.Vector(
new OpenLayers.Geometry.Point( -0.1279688, 51.5077286 ).transform(epsg4326, projectTo),
{description:'This is the value of<br>the description attribute'} ,
{externalGraphic: 'img/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
);
vectorLayer.addFeatures(feature);

var feature = new OpenLayers.Feature.Vector(
new OpenLayers.Geometry.Point( -0.1244324, 51.5006728  ).transform(epsg4326, projectTo),
{description:'Big Ben'} ,
{externalGraphic: 'img/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
);
vectorLayer.addFeatures(feature);

var feature = new OpenLayers.Feature.Vector(
new OpenLayers.Geometry.Point( -0.119623, 51.503308  ).transform(epsg4326, projectTo),
{description:'London Eye'} ,
{externalGraphic: 'img/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
);
vectorLayer.addFeatures(feature);


map.addLayer(vectorLayer);


//Add a selector control to the vectorLayer with popup functions
var controls = {
selector: new OpenLayers.Control.SelectFeature(vectorLayer, { onSelect: createPopup, onUnselect: destroyPopup })
};

function createPopup(feature) {
feature.popup = new OpenLayers.Popup.FramedCloud("pop",
feature.geometry.getBounds().getCenterLonLat(),
null,
'<div class="markerContent">'+feature.attributes.description+'</div>',
null,
true,
function() { controls['selector'].unselectAll(); }
);
//feature.popup.closeOnMove = true;
map.addPopup(feature.popup);
}

function destroyPopup(feature) {
feature.popup.destroy();
feature.popup = null;
}

map.addControl(controls['selector']);
controls['selector'].activate();

*/
