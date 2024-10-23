//MAPTILER
//maptilersdk.config.apiKey = '4oXeihv8TRlNgvDIP168';
//const key = '4oXeihv8TRlNgvDIP168';

var map = L.map("map", {zoomControl: false}).setView([57.5,18.78], 9);

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

const geojsonGotland = new L.GeoJSON.AJAX("https://api.maptiler.com/data/b8a04b8f-0a30-41e0-8b2a-081aa2153fbd/features.json?key=4oXeihv8TRlNgvDIP168",{
	onEachFeature:popupPoly,
	style: gotlandStyle 
});

//Geoserver Web Feature Service for radjur
$.ajax('http://localhost:8086/geoserver/wfs',{
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
	jsonpCallback:'callback:handleJsonRadjur',
	jsonp:'format_options'
});

var layerDataRadjur = new L.GeoJSON(null, {
	onEachFeature: popup,
	pointToLayer: function (feature, latlng) {
		return(L.circleMarker(latlng, determineStyle(feature))); //return L.marker(latlng, {icon: iconPath});
	}
});

function handleJsonRadjur(data1) {
	layerDataRadjur.addData(data1).addTo(map);
	//map.fitBounds(layerDataRadjur.getBounds());
}

//Geoserver Web Feature Service for kantareller
$.ajax('http://localhost:8086/geoserver/wfs',{
	type: 'GET',
	data: {
		service: 'WFS',
		version: '1.1.0',
		request: 'GetFeature',
		typename: 'sweden:kantareller',
		//CQL_FILTER: "NAME_1 LIKE 'V%'",
		srsname: 'EPSG:4326',
		outputFormat: 'text/javascript',
	},
	dataType: 'jsonp',
	jsonpCallback:'callback:handleJsonKantareller',
	jsonp:'format_options'
});

var layerDataKantareller = new L.GeoJSON(null, {
	onEachFeature: popup,
	pointToLayer: function (feature, latlng) {
		return(L.circleMarker(latlng, determineStyle(feature))); //return L.marker(latlng, {icon: iconPath});
	}
});

function handleJsonKantareller(data1) {
	layerDataKantareller.addData(data1).addTo(map);
	//map.fitBounds(layerDataKantareller.getBounds());
}

//Geoserver Web Feature Service for trattisar
$.ajax('http://localhost:8086/geoserver/wfs',{
	type: 'GET',
	data: {
		service: 'WFS',
		version: '1.1.0',
		request: 'GetFeature',
		typename: 'sweden:trattisar',
		//CQL_FILTER: "NAME_1 LIKE 'V%'",
		srsname: 'EPSG:4326',
		outputFormat: 'text/javascript',
	},
	dataType: 'jsonp',
	jsonpCallback:'callback:handleJsonTrattisar',
	jsonp:'format_options'
});

var layerDataTrattisar = new L.GeoJSON(null, {
	onEachFeature: popup,
	pointToLayer: function (feature, latlng) {
		return(L.circleMarker(latlng, determineStyle(feature))); //return L.marker(latlng, {icon: iconPath});
	}
});

function handleJsonTrattisar(data1) {
	layerDataTrattisar.addData(data1).addTo(map);
	//map.fitBounds(layerDataTrattisar.getBounds());
}

//========================================================== DATA

function popup(feature, layer) {
	var species = feature.properties.species;
	var count = feature.properties.individual;
	var popupContent, toolTipContent;
	if(count == null) count = 1;
	
	var name = species;
	var link = "https://www.google.com/search?q=";
	for(var i = 0; i < name.length; i++) {
		if(name[i] == " ") link += "+";
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
	
	popupContent += "<br><b>" + count + "</b> stycken " + "<a target='_blank' href="+link+">"+name+"</a>" +" observerade";
	toolTipContent = "<h4>" + species + "</h4>";
	
	layer.bindPopup(popupContent);
	layer.bindTooltip(toolTipContent,{noHide: true}).open;
}

function popupPoly(feature, layer) {
	//layer.bindPopup("");
	layer.bindTooltip("<h4>" + feature.properties.NAME_1 + "</h4>",{noHide: true}).open;
}

function determineStyle(feature) {
	var color, radius, fillColor;
	var species = feature.properties.species;
	var count = feature.properties.individual;
	
	if (species == "Capreolus capreolus") {
		let element = document.querySelector('.radjur');
		let colorStyle = window.getComputedStyle(element).backgroundColor;
		color = colorStyle;
		colorStyle = colorStyle.replace(".8",".2")
		fillColor = colorStyle;
	} else if (species == "Craterellus tubaeformis") {
		let element = document.querySelector('.trattisar');
		let colorStyle = window.getComputedStyle(element).backgroundColor;
		color = colorStyle;
		colorStyle = colorStyle.replace(".8",".2")
		fillColor = colorStyle;
	} else if (species == "Cantharellus cibarius") {
		let element = document.querySelector('.kantareller');
		let colorStyle = window.getComputedStyle(element).backgroundColor;
		color = colorStyle;
		colorStyle = colorStyle.replace(".8",".2")
		fillColor = colorStyle;
	} else {
		console.log('Unknown species', species)
		return;
	}
	
	if(count != null) radius = count;
	else radius = 1;
	
	return {color:color, radius:radius, fillColor: fillColor, weight: 1.5, opacity: 1, fillOpacity: 0.6};
}

var basemaps = {
	"OSM": osm,
};

var overlays = {
	"Gotland": geojsonGotland,
	"Rådjur": layerDataRadjur,
	"Kantareller": layerDataKantareller,
	"Trattkantareller": layerDataTrattisar
};

var layersControl = L.control.layers
(
	basemaps,
	overlays,
	{ collapsed: true, position:"topleft" }
).addTo(map);