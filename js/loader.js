// JavaScript Document
function init() {
		   
	   window.addEventListener('scroll', function(e){
		   
        	var distanceY = window.pageYOffset || document.documentElement.scrollTop,
            shrinkOn = 80,
            header = document.querySelector("header");
        	if (distanceY > shrinkOn) {
            classie.add(header,"smaller");
        	} else {
            	if (classie.has(header,"smaller")) {
                	classie.remove(header,"smaller");
           		}
        	}
			
   		});

	 $( "#bigPapaLoader" ).fadeOut( "slow" );
	
	
	 
}


window.onload = function() {
    
	
	 myVar = setTimeout(init, 3000);
	 
	
 
    
};
