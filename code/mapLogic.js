//MAPTILER
//maptilersdk.config.apiKey = '4oXeihv8TRlNgvDIP168';
//const key = '4oXeihv8TRlNgvDIP168';

var map = L.map("map", { zoomControl: false }).setView([57.5, 18.78], 9);

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//========================================================== DATA #1
/*
const geojsonRadjur = new L.GeoJSON.AJAX("radjur.geojson",{
	onEachFeature: popup,
	pointToLayer: function (feature, latlng) {
		return(L.circleMarker(latlng, determineStyle(feature))); //return L.marker(latlng, {icon: iconPath});
	}
}).addTo(map);

const geojsonKantareller = new L.GeoJSON.AJAX("kantareller.geojson",{
	onEachFeature: popup,
	pointToLayer: function (feature, latlng) {
		return(L.circleMarker(latlng, determineStyle(feature))); //return L.marker(latlng, {icon: iconPath});
	}
}).addTo(map);

const geojsonTrattisar = new L.GeoJSON.AJAX("trattisar.geojson",{
	onEachFeature: popup,
	pointToLayer: function (feature, latlng) {
		return(L.circleMarker(latlng, determineStyle(feature))); //return L.marker(latlng, {icon: iconPath});
	}
}).addTo(map);
*/

//Geojson style
function gotlandStyle(feature) {
	return {
		fillColor: "rgba(255,255,255,0.2)",
		fillOpacity: 0.2,
		color: "rgba(0,0,0,0.5)",
		weight: 4,
	};
}

const geojsonGotland = new L.GeoJSON.AJAX("https://api.maptiler.com/data/b8a04b8f-0a30-41e0-8b2a-081aa2153fbd/features.json?key=4oXeihv8TRlNgvDIP168", {
	onEachFeature: popupPoly,
	style: gotlandStyle
});
var typeOfTool = document.getElementById("tool").value;
tool.addEventListener("change", function () {
	typeOfTool = document.getElementById("tool").value;
});

var itemForNear = document.getElementById("nearItem").value;
nearItem.addEventListener("change", function () {
	itemForNear = document.getElementById("nearItem").value;
});

var distanceForBuffer = document.getElementById("bufferDist").value;
bufferDist.addEventListener("change", function () {
	distanceForBuffer = document.getElementById("bufferDist").value;
});
var distanceForNear = document.getElementById("nearDist").value;
nearDist.addEventListener("change", function () {
	distanceForNear = document.getElementById("nearDist").value;
});

const button = document.getElementById("clear");

// Add a click event listener
button.addEventListener("click", function () {
	if (geojsonBufferPoints != undefined) {
		map.removeLayer(geojsonBufferPoints);
	}
	if (geojsonBufferLines != undefined) {
		map.removeLayer(geojsonBufferLines);
	}
	if (buffer != undefined) {
		map.removeLayer(buffer);
	}
	if (geojsonPoint != undefined) {
		map.removeLayer(geojsonPoint);
	}
	if (geojsonRoadLine != undefined) {
		map.removeLayer(geojsonRoadLine);
	}
});
function roadStyle(feature) {
	return {
		//fillColor: "#FF00FF",
		fillOpacity: 0.5,
		//color: '#B04173',
		color: 'blue',
		weight: 4
	};
}

$.ajax('http://localhost:8086/geoserver/wfs', {
	type: 'GET',
	data: {
		service: 'WFS',
		version: '1.1.0',
		request: 'GetFeature',
		typename: 'sweden:vagData',
		srsname: 'EPSG:4326',
		outputFormat: 'text/javascript',
	},
	dataType: 'jsonp',
	jsonpCallback: 'callback:handleRoadsJson',
	jsonp: 'format_options'
});
var roadLayerData = new L.GeoJSON(null, {
	style: roadStyle(),
});

function handleRoadsJson(data1) {
	roadLayerData.addData(data1).addTo(map);
	map.fitBounds(roadLayerData.getBounds());
}


var radjurMarkers = [];

var RIcon = L.icon({
	iconUrl: 'icons/deer.svg',
	iconSize: [2, 2],
});

var CIcon = L.icon({
	iconUrl: 'icons/chanterelle.svg',
	iconSize: [15, 15],
});
/*
const geojsonRadjur = new L.GeoJSON.AJAX('https://api.maptiler.com/data/7ca9fb19-2258-4b6f-b776-2b58a0690c5e/features.json?key=LWd1UTuzESmuE1dXHVEU', {
	onEachFeature: function (feature, layer) {
		popup(feature, layer)
		var latlng = layer.getLatLng()
		var radjurMarker = L.marker([latlng.lat, latlng.lng], { icon: RIcon }).addTo(map);
		radjurMarkers.push(radjurMarker);
	},
	pointToLayer: function (feature, latlng) {
		return (L.circleMarker(latlng, determineStyle(feature))); //return L.marker(latlng, {icon: iconPath});
	}
	
}).addTo(map);*/

//Geoserver Web Feature Service for radjur


function toolChooser(e) {
	if (typeOfTool == "buffer") {
		calculateBufferZone(e);
	} else {
		if (itemForNear == "vag") {
			calculateNearestRoad(e);
		} else {
			calculateNearestPoint(e);
		}
	}
}


$.ajax('http://localhost:8086/geoserver/wfs', {
	type: 'GET',
	data: {
		service: 'WFS',
		version: '1.1.0',
		request: 'GetFeature',
		typename: 'sweden:radjur',
		//CQL_FILTER: "NAME_1 LIKE 'V%'",
		srsname: 'EPSG:4326',
		outputFormat: 'text/javascript',
	},
	dataType: 'jsonp',
	jsonpCallback: 'callback:handleJsonRadjur',
	jsonp: 'format_options'
});

var layerDataRadjur = new L.GeoJSON(null, {
	onEachFeature: radjurOnEachFeature,
	pointToLayer: function (feature, latlng) {
		return (L.circleMarker(latlng, determineStyle(feature))); //return L.marker(latlng, {icon: iconPath});
	}
});

function radjurOnEachFeature(feature, layer) {
	popup(feature, layer)
	layer.on({
		click: toolChooser
	});
}

/*function radjurOnEachFeature(feature, layer) {
	popup(feature, layer)
	var latlng = layer.getLatLng()
	var radjurMarker = L.marker([latlng.lat, latlng.lng], { icon: RIcon }).addTo(map);
	radjurMarkers.push(radjurMarker);

}*/
function handleJsonRadjur(data1) {
	layerDataRadjur.addData(data1).addTo(map);
	//map.fitBounds(layerDataRadjur.getBounds());
}

//Geoserver Web Feature Service for kantareller
$.ajax('http://localhost:8086/geoserver/wfs', {
	type: 'GET',
	data: {
		service: 'WFS',
		version: '1.1.0',
		request: 'GetFeature',
		typename: 'sweden:kantarellerFix',
		//CQL_FILTER: "NAME_1 LIKE 'V%'",
		srsname: 'EPSG:4326',
		outputFormat: 'text/javascript',
	},
	dataType: 'jsonp',
	jsonpCallback: 'callback:handleJsonKantareller',
	jsonp: 'format_options'
});

var layerDataKantareller = new L.GeoJSON(null, {
	onEachFeature: kantarellerOnEachFeature,
	pointToLayer: function (feature, latlng) {
		return (L.circleMarker(latlng, determineStyle(feature))); //return L.marker(latlng, {icon: iconPath});
	}
});

function kantarellerOnEachFeature(feature, layer) {
	popup(feature, layer)
	layer.on({
		click: toolChooser
	});

}
function handleJsonKantareller(data1) {
	layerDataKantareller.addData(data1).addTo(map);
	//map.fitBounds(layerDataKantareller.getBounds());
}

//Geoserver Web Feature Service for trattisar
$.ajax('http://localhost:8086/geoserver/wfs', {
	type: 'GET',
	data: {
		service: 'WFS',
		version: '1.1.0',
		request: 'GetFeature',
		typename: 'sweden:trattisarFix',
		//CQL_FILTER: "NAME_1 LIKE 'V%'",
		srsname: 'EPSG:4326',
		outputFormat: 'text/javascript',
	},
	dataType: 'jsonp',
	jsonpCallback: 'callback:handleJsonTrattisar',
	jsonp: 'format_options'
});

var layerDataTrattisar = new L.GeoJSON(null, {
	onEachFeature: trattisarOnEachFeature,
	pointToLayer: function (feature, latlng) {
		return (L.circleMarker(latlng, determineStyle(feature))); //return L.marker(latlng, {icon: iconPath});
	}
});

function trattisarOnEachFeature(feature, layer) {
	popup(feature, layer)
	layer.on({
		click: toolChooser
	});

}

function handleJsonTrattisar(data1) {
	layerDataTrattisar.addData(data1).addTo(map);
	//map.fitBounds(layerDataTrattisar.getBounds());
}

//========================================================== DATA

function popup(feature, layer) {
	var species = feature.properties.species;
	var count = feature.properties.individual;
	var popupContent, toolTipContent;
	if (count == null) count = 1;

	var name = species;
	var link = "https://www.google.com/search?q=";
	for (var i = 0; i < name.length; i++) {
		if (name[i] == " ") link += "+";
		else link += name[i];
	}

	if (species == "Capreolus capreolus") {
		popupContent = "<img src='https://cdn.pixabay.com/photo/2019/10/30/16/17/animal-4589923_1280.jpg' width='250px' height='200px' style='border-radius:50%'>";
		//toolTipContent = ""; 
	} else if (species == "Craterellus tubaeformis") {
		popupContent = "<img src='https://cdn.pixabay.com/photo/2017/10/02/21/43/mushroom-2810448_1280.jpg' width='250px' height='200px' style='border-radius:50%'>";
		//toolTipContent = ""; 
	} else if (species == "Cantharellus cibarius") {
		popupContent = "<img src='https://cdn.pixabay.com/photo/2016/02/11/19/46/fungus-1194380_1280.jpg' width='250px' height='200px' style='border-radius:50%'>";
		//toolTipContent = ""; 
	} else {
		console.log('Unknown species', species)
		return;
	}

	popupContent += "<br><b>" + count + "</b> stycken " + "<a target='_blank' href=" + link + ">" + name + "</a>" + " observerade";
	toolTipContent = "<h4>" + species + "</h4>";

	layer.bindPopup(popupContent);
	layer.bindTooltip(toolTipContent, { noHide: true }).open;
}

function popupPoly(feature, layer) {
	//layer.bindPopup("");
	layer.bindTooltip("<h4>" + feature.properties.NAME_1 + "</h4>", { noHide: true }).open;
}

function determineStyle(feature) {
	var color, radius, fillColor;
	var species = feature.properties.species;
	var count = feature.properties.individual;

	if (species == "Capreolus capreolus") {
		let element = document.querySelector('.radjur');
		let colorStyle = window.getComputedStyle(element).backgroundColor;
		color = colorStyle;
		colorStyle = colorStyle.replace(".8", ".2")
		fillColor = colorStyle;
	} else if (species == "Craterellus tubaeformis") {
		let element = document.querySelector('.trattisar');
		let colorStyle = window.getComputedStyle(element).backgroundColor;
		color = colorStyle;
		colorStyle = colorStyle.replace(".8", ".2")
		fillColor = colorStyle;
	} else if (species == "Cantharellus cibarius") {
		let element = document.querySelector('.kantareller');
		let colorStyle = window.getComputedStyle(element).backgroundColor;
		color = colorStyle;
		colorStyle = colorStyle.replace(".8", ".2")
		fillColor = colorStyle;
	} else {
		console.log('Unknown species', species)
		return;
	}

	if (count != null) radius = count * 1;
	else radius = 1;

	return { color: color, radius: radius, fillColor: fillColor, weight: 1.5, opacity: 1, fillOpacity: 0.6 };
}

var basemaps = {
	"OSM": osm,
};

var overlays = {
	"Gotland": geojsonGotland,
	"Rådjur": layerDataRadjur,
	"Kantareller": layerDataKantareller,
	"Trattkantareller": layerDataTrattisar,
	"Vägar": roadLayerData
};

var layersControl = L.control.layers
	(
		basemaps,
		overlays,
		{ collapsed: true, position: "topleft" }
	).addTo(map);

var geojsonRoadLine;
function calculateNearestRoad(e) {
	if (geojsonRoadLine != undefined) {
		map.removeLayer(geojsonRoadLine);
	}
	layer = e.target;
	var latlng = layer.getLatLng();
	xy = [latlng.lat, latlng.lng];  //clicked coordinate
	var theRadius = Number(distanceForNear);
	var road;
	var closestDist;

	roadLayerData.eachLayer(function (layer) {
		// Lat, long of current point as it loops through.
		layer_lat_long = layer.getLatLngs();
		var distance_from_centerPoint = []
		for (var i = 0; i < layer_lat_long[0].length; i++) {
			var dist = layer_lat_long[0][i].distanceTo(xy);
			distance_from_centerPoint.push(dist);
		}

		//console.log("Distance " + distance_from_centerPoint);

		// See if the point is within the radius, add the to array
		for (var i = 0; i < distance_from_centerPoint.length; i++) {
			if (distance_from_centerPoint[i] <= theRadius) {
				if (closestDist != undefined) {
					if (closestDist > distance_from_centerPoint[i]) {
						closestDist = distance_from_centerPoint[i];
						road = layer.feature
					}
				} else {
					closestDist = distance_from_centerPoint[i];

					road = layer.feature
				}
			}
		}



	});
	geojsonRoadLine = L.geoJson(road, {
		style: function (feature) {
			return {
				color: 'red',
				weight: 4,
				fillOpacity: 0.5
			};
		}
	});
	//Add selected points back into map as green circles.
	map.addLayer(geojsonRoadLine);
}
var geojsonPoint;
var highNumber = 10000000;
function calculateNearestPoint(e) {
	if (geojsonPoint != undefined) {
		map.removeLayer(geojsonPoint);
	}
	layer = e.target;
	var latlng = layer.getLatLng();
	xy = [latlng.lat, latlng.lng];  //clicked coordinate
	var theRadius = Number(distanceForNear);
	var point;
	var closestDist;
	var data;
	if (itemForNear == "radjur") {
		data = layerDataRadjur
	} else if (itemForNear == "trattisar") {
		data = layerDataTrattisar
	} else {
		data = layerDataKantareller
	}
	data.eachLayer(function (layer) {
		// Lat, long of current point as it loops through.
		layer_lat_long = layer.getLatLng();
		var distance_from_centerPoint = layer_lat_long.distanceTo(xy);
		if (distance_from_centerPoint == 0) distance_from_centerPoint = highNumber
		//console.log("Distance " + distance_from_centerPoint);

		// See if the point is within the radius, add the to array
		if (distance_from_centerPoint <= theRadius) {
			if (closestDist != undefined) {
				if (closestDist > distance_from_centerPoint) {
					closestDist = distance_from_centerPoint;
					point = layer.feature
				}
			} else {
				closestDist = distance_from_centerPoint;
				point = layer.feature
			}
		}
	});
	geojsonPoint = L.geoJson(point, {
		pointToLayer: function (feature, latlng) {
			var radius = feature.properties.individual;
			if (radius == null) radius = 1;
			return L.circleMarker(latlng, {
				radius: radius, //expressed in pixels circle size
				color: "red",
				stroke: true,
				weight: 2,		//outline width  increased width to look like a filled circle.
				fillOpcaity: 0.7

			});
		}
	});
	//Add selected points back into map as green circles.
	map.addLayer(geojsonPoint);
}

var geojsonBufferPoints;
var geojsonBufferLines;
var buffer;

function calculateBufferZone(e) {
	if (geojsonBufferPoints != undefined) {
		map.removeLayer(geojsonBufferPoints);
	}
	if (geojsonBufferLines != undefined) {
		map.removeLayer(geojsonBufferLines);
	}
	if (buffer != undefined) {
		map.removeLayer(buffer);
	}
	const checkboxes = document.querySelectorAll('input[name="option"]:checked');
	const values = Array.from(checkboxes).map(cb => cb.value);
	layer = e.target
	var latlng = layer.getLatLng();
	xy = [latlng.lat, latlng.lng];  //clicked coordinate
	var theRadius = Number(distanceForBuffer);
	var points = [];
	var roads = [];
	var pointData = [];
	var lineData;
	for (var i = 0; i < values.length; i++) {
		if (values[i] != "vag") {
			if (values[i] == "radjur") {
				pointData.push(layerDataRadjur);
			} else if (values[i] == "trattisar") {
				pointData.push(layerDataTrattisar);
			} else pointData.push(layerDataKantareller);
		} else lineData = roadLayerData;
	}
	for (var i = 0; i < pointData.length; i++) {
		pointData[i].eachLayer(function (layer) {
			// Lat, long of current point as it loops through.
			layer_lat_long = layer.getLatLng();
			// All distances to the clicked point to earthquakes points
			distance_from_centerPoint = layer_lat_long.distanceTo(xy);
			if (distance_from_centerPoint == 0) distance_from_centerPoint = highNumber
			//console.log("Distance " + distance_from_centerPoint);

			// See if the point is within the radius, add the to array
			if (distance_from_centerPoint <= theRadius) {
				points.push(layer.feature);
			}
		});
	}
	if (lineData != undefined) {
		lineData.eachLayer(function (layer) {
			// Lat, long of current point as it loops through.
			layer_lat_long = layer.getLatLngs();
			var distance_from_centerPoint = []
			for (var i = 0; i < layer_lat_long[0].length; i++) {
				var dist = layer_lat_long[0][i].distanceTo(xy);
				distance_from_centerPoint.push(dist);
			}

			//console.log("Distance " + distance_from_centerPoint);

			// See if the point is within the radius, add the to array
			for (var i = 0; i < distance_from_centerPoint.length; i++) {
				if (distance_from_centerPoint[i] <= theRadius) {
					roads.push(layer.feature);
				}
			}
		});
	}

	buffer = L.circle(xy, theRadius, {
		color: 'green',
		fillOpacity: 0,
		opacity: 0.5,
	}).addTo(map);
	if (roads.length != 0) {
		geojsonBufferLines = L.geoJson(roads, {
			style: function (feature) {
				return {
					color: 'red',
					weight: 4,
					fillOpacity: 0.5
				};
			}
		});
		//Add selected points back into map as green circles.
		map.addLayer(geojsonBufferLines);
	}

	if (points.length != 0) {
		geojsonBufferPoints = L.geoJson(points, {
			pointToLayer: function (feature, latlng) {
				var radius = feature.properties.individual;
				if (radius == null) radius = 1;
				return L.circleMarker(latlng, {
					radius: radius, //expressed in pixels circle size
					color: "red",
					stroke: true,
					weight: 2,		//outline width  increased width to look like a filled circle.
					fillOpcaity: 0.7

				});
			}
		});
		//Add selected points back into map as green circles.
		map.addLayer(geojsonBufferPoints);
	}
}