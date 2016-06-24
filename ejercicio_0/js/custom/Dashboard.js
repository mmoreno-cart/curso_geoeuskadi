/* DOM */
var dom = {
	chart1: $('#chart-1'),
	chart2: $('#chart-2'),
	table: $('#table')
};

/* Crossfilter */
var cf;
var filterFromCode = false;

/* Asignación gráficos */



/* Fin asignación gráficos */

// Cargar vista a partir de los datos recibidos
function initDashboard(data){
	console.log(data);
	
	initMap('map');
	
	/* Ajuste de datos */
	var clean_data = [];
	data.forEach(function (d) {
		if (d.Latitud && d.Longitud) {
			if (!d.Tipo || d.Tipo == '') {
				d.Tipo = 'No disponible';
			}
			if (!d.Vinculacion || d.Vinculacion == '') {
				d.Vinculacion = 'No disponible';
			}
			if (!d.Aportacion_usuario || d.Aportacion_usuario == '') {
				d.Aportacion_usuario = 'No disponible';
			}
			clean_data.push(d);
		}
	});
	
	/* Configuración Crossfilter */
	
	// Dimensiones

	
	// Grupos

	
	/* Gráficos */
	
	
	
	/* Fin gráficos */
	
	/*
	for (var i = 0; i < dc.chartRegistry.list().length; i++) {
		var chartI = dc.chartRegistry.list()[i];
		chartI.on("filtered", function(chart, filter){ if (filterFromCode === false) { chartFiltered(); }});
	}
	
	map.on("moveend", onmapmoveend);
	
	updateMapPoints();
	//geofilter();
	dc.renderAll();
	*/
}

// Función para calcular altura de los gráficos de barras
function calculateChartHeight(value_number, max_rows, row_height, gaps) {
	var n;
	var h;
	(value_number < max_rows) ? n=value_number : n=max_rows;
	h = n * row_height + gaps;
	return h;
}