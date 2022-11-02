$( document ).ready(function() {
	var options = {
	  "animate": true,
  "patternWidth": 20.81,
  "patternHeight": 58.63,
  "grainOpacity": 0.13,
  "grainDensity": 2.89,
  "grainWidth": 1.5,
  "grainHeight": 3.58
	}
    grained('#tv',options);
	
	var p = $( "bckgr p" );
	var currentP = p.scrollTop();
	console.log(currentP);
	//$( "p:last" ).text( "scrollTop:" + p.scrollTop() );
	
});
