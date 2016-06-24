$(document).on('ready', function () {

	// Llamar a los datos
	
	//Mapa_RR_SOSA_ARABA_es_MOD.csv
	var dsv = d3.dsv(";", "text/plain");
	dsv("https://gist.githubusercontent.com/mmoreno-cart/420e6e4bfd2e0a3b515a79cf7dcd3b03/raw/33f07668bd8ba4a816e21f2f197d0912c32e140f/Mapa_RR_SOSA_ARABA_es_MOD.csv", function(data){
	//dsv("data/Mapa_RR_SOSA_ARABA_es_MOD.csv", function(data){
		initDashboard(data);
	});

});

