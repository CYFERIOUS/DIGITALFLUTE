var datosInfo;
var datosEdu;
var datosFun;
$( document ).ready(function() { 
	console.log("para datosInfo");
	function dataInformation(){
		$.getJSON( "js/info.json", function(json) {
			datosInfo = json;
		});	
	}
	console.log("para datosEdu");
	function dataEducation(){
		$.getJSON( "js/edu.json", function(json) {
			datosEdu = json;
		});	
	}
	console.log("para datosFun");
	function dataVideoGames(){
		$.getJSON( "js/fun.json", function(json) {
			datosFun = json;
		});	
	}
	dataInformation();
	dataEducation();
	dataVideoGames();
});