var datosInfo;
var datosEdu;
var datosFun;
$( document ).ready(function() { 
	console.log("para datosInfo");
	
	function dataInformation(){
		$.getJSON( "http://localhost:5000/info", function(json) {
			datosInfo = json;
			console.log("Datos Info cargados:", datosInfo);
		}).fail(function(jqXHR, textStatus, errorThrown) {
            console.error("Error loading info.json:", textStatus, errorThrown);
        });	
	}
	console.log("para datosEdu");
	function dataEducation(){
		$.getJSON( "http://localhost:5000/edu", function(json) {
			datosEdu = json;
		}) .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("Error loading info.json:", textStatus, errorThrown);
        });	
	}
	console.log("para datosFun");
	function dataVideoGames(){
		$.getJSON( "http://localhost:5000/fun", function(json) {
			datosFun = json;
		}) .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("Error loading info.json:", textStatus, errorThrown);
        });	
	}
	dataInformation();
	dataEducation();
	dataVideoGames();
});