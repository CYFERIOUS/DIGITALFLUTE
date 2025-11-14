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
		$( "#info" ).load( "sections/infoSection_dynamic.php" );
		$( "#learn" ).load( "sections/learnSection_dynamic.php" );
		$( "#fun" ).load( "sections/funnySection_dynamic.php" );
		$( "#contacto" ).load( "sections/contact.php" );
		$( "#footer" ).load( "sections/footer.php" );
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
	
	
