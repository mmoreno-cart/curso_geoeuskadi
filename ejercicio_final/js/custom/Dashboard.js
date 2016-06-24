/* DOM */
var dom = {
	chart1: $('#chart-1'),
	chart2: $('#chart-2'),
	chart3: $('#chart-3'),
	table: $('#table')
};

/* Crossfilter */
var cf;
var filterFromCode = false;

/* Asignación gráficos */
var charts = {};
charts.Tipo = dc.rowChart("#chart-1");
charts.Vinculacion = dc.pieChart('#chart-2');
charts.Aportacion_usuario = dc.rowChart('#chart-3');
charts.Table = dc.dataTable('.dc-data-table');

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
	cf = crossfilter(clean_data);
	
	// Dimensiones
	cf.dim = {};
	cf.dim.Tipo = cf.dimension(function(d){ return d.Tipo; });
	cf.dim.Vinculacion = cf.dimension(function(d){ return d.Vinculacion; });
	cf.dim.Aportacion_usuario = cf.dimension(function(d){ return d.Aportacion_usuario; });
	cf.dim.N = cf.dimension(function(d){ return d.N; });
	cf.dim.Latitud = cf.dimension(function(d){ return +d.Latitud; });
	cf.dim.Longitud = cf.dimension(function(d){ return +d.Longitud; });
	
	// Grupos
	cf.grp = {};
	cf.grp.Tipo = cf.dim.Tipo.group();
	cf.grp.Vinculacion = cf.dim.Vinculacion.group();
	cf.grp.Aportacion_usuario_Plazas = cf.dim.Aportacion_usuario.group().reduceSum(function(d) { return d.Plazas; });
	cf.grp.N = cf.dim.N.group();
	cf.grp.Latitud = cf.dim.Latitud.group();
	cf.grp.Longitud = cf.dim.Longitud.group();
	
	cf.grp.all = cf.groupAll();
	
	/* Gráficos */
	$(dom.chart1).html('<h4>Tipo de recurso (Top 10)</h4>');
	charts.Tipo
		.width(250)
		.height(calculateChartHeight(cf.grp.Tipo.size(),10, 25, 40))//
		.dimension(cf.dim.Tipo)
		.group(cf.grp.Tipo)
		.elasticX(true)
		.data(function(group) {	return group.top(10); })
		.colors(['#6DDC7A'])
		.colorAccessor(function(d, i){ return 0;})
		.xAxis().ticks(3);//.tickFormat(d3.format("g"));
	
	$(dom.chart2).html('<h4>Vinculación</h4>');
	charts.Vinculacion
        .dimension(cf.dim.Vinculacion)
        .group(cf.grp.Vinculacion)
        .width(180)
        .height(180)
        .radius(80)
        .innerRadius(30);
	
	$(dom.chart3).html('<h4>Plazas por tipo de aportación</h4>');
	charts.Aportacion_usuario
		.width(250)
		.height(calculateChartHeight(cf.grp.Aportacion_usuario_Plazas.size(),10, 25, 40))//
		.dimension(cf.dim.Aportacion_usuario)
		.group(cf.grp.Aportacion_usuario_Plazas)
		.elasticX(true)
		.data(function(group) {	return group.top(10); })
		.colors(['#6DDC7A'])
		.colorAccessor(function(d, i){ return 0;})
		.xAxis().ticks(3);//.tickFormat(d3.format("g"));
	
	dc.dataCount("#filter-indicator")
		.dimension(cf)
		.group(cf.grp.all);
	
	charts.Table
        .dimension(cf.dim.Tipo)
        // Data table does not use crossfilter group but rather a closure
        // as a grouping function
        .group(function (d) {
			return d.Tipo;
        })
        // (_optional_) max number of records to be shown, `default = 25`
        .size(cf.grp.N.size())
        // There are several ways to specify the columns; see the data-table documentation.
        // This code demonstrates generating the column header automatically based on the columns.
        .columns([			
			function(d) {
				return d.Denominacion;
			},
			function(d) {
				return d.Poblacion_destinataria;
			}			
		])
        // (_optional_) sort using the given field, `default = function(d){return d;}`
        .sortBy(function (d) {
            return d.Denominacion;
        })
        // (_optional_) sort order, `default = d3.ascending`
        .order(d3.ascending)
        // (_optional_) custom renderlet to post-process chart using [D3](http://d3js.org)
        .on('renderlet', function (table) {
            table.selectAll('.dc-table-group').classed('info', true);
        });
	
	for (var i = 0; i < dc.chartRegistry.list().length; i++) {
		var chartI = dc.chartRegistry.list()[i];
		chartI.on("filtered", function(chart, filter){ if (filterFromCode === false) { chartFiltered(); }});
	}
	
	map.on("moveend", onmapmoveend);
	
	updateMapPoints();
	//geofilter();
	dc.renderAll();
	//filterFromCode = false;
	
}

// Función para calcular altura de los gráficos de barras
function calculateChartHeight(value_number, max_rows, row_height, gaps) {
	var n;
	var h;
	(value_number < max_rows) ? n=value_number : n=max_rows;
	h = n * row_height + gaps;
	return h;
}