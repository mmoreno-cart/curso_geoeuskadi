/* Mapa */
var map;
var cluster_layer;
var info;

// Cargar mapa
function initMap(idmap){
	
	// Mapas base
	var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://cartodb.com/attributions">CartoDB</a>',
		subdomains: 'abcd',
		maxZoom: 19
	});
	var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="https://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
	});
	var Geoeuskadi = L.tileLayer.wms("http://www.geo.euskadi.eus/WMS_ORTOARGAZKIAK", {
		layers: 'ORTO_EGUNERATUENA_MAS_ACTUALIZADA',
		format: 'image/png',
		//transparent: true,
		attribution: "Eusko Jaurlaritza / Gobierno Vasco"
	});
	var basemaps = {
		'HOT': OpenStreetMap_HOT,
		'Claro': CartoDB_Positron,
		'Satélite': Geoeuskadi
	};
	
	// Definicion mapa
	map = L.map(idmap,{
		center: [42.85, -2.67], // y,x //[20, 0], //Burundi: lat: -3.39, lng: 29.95 //Region: lat: -2.21, lng: 29.71
		zoom: 8,
		maxZoom:16,
		minZoom:1,
		layers: [CartoDB_Positron],
		attributionControl: true
	});
	
	// Capa cluster para eventos (vacía en un principio)
	cluster_layer = L.markerClusterGroup({
		showCoverageOnHover		: false,
		maxClusterRadius		: 40,
		//disableClusteringAtZoom	: 8,
		spiderfyOnMaxZoom		: true
	});
	var overlays = {
		"Recursos socio-sanitarios": cluster_layer,
	};
	map.addLayer(cluster_layer);
	
	L.control.layers(basemaps, overlays).addTo(map);
	
	// control que muestra el nombre del evento al pasar el ratón por encima
	info = L.control({ position: 'bottomleft'});
	info.onAdd = function (map) {
		if ($('.info').length < 1) {
			this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		}		
		this.update();
		return this._div;
	};
	info.update = function (title) {
		this._div.innerHTML = (title ?
			'<b>' + title + '</b>'
			: 'Hover over an event');
	};
	
}