// JavaScript Document


$(function() {
	
       function focusIframe(){
        
		document.addEventListener('keydown', e => {
	  		const frame =  document.getElementById("firstIntro");
	  		frame.contentDocument.dispatchEvent(
	    			new KeyboardEvent('keydown', {key: e.key})
	  		);
		});

	}
        
	function callSektor(){
		$( "#info" ).load( "sessions/infoSection.php" );
		$( "#learn" ).load( "sessions/learnSection.php" );
		$( "#fun" ).load( "sessions/funnySection.php" );
		$( "#contacto" ).load( "sessions/contact.php" );
		$( "#footer" ).load( "sessions/info.php" );
	} 
	
    function reloadContactSektor(){
		var reloadContact1 = { useFixedPanelHeights: true, defaultPanel: 0 }
		var reloadContact2 = { useFixedPanelHeights: true, defaultPanel: 4 }
		if(window.location=='http://www.dgflute.com/#contacto' || window.location=='http://www.digital-flute.com/#contacto'){
			new Spry.Widget.Accordion("Accordion1",reloadContact2);
		}else{
			new Spry.Widget.Accordion("Accordion1",reloadContact1);
		}
	}
	setTimeout(function(){ 
		callSektor();
		reloadContactSektor();
		focusIframe();
	}, 1000);
	
	
 	
	
});
	
	
