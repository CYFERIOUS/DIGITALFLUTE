$(function(){
	
	
	$( ".scrollerTittle" ).css( "font-size", "40px" );
	$( ".scrollerTittle" ).css( "margin-left", "25%" );
	
	$(".boxShow").hide();
	$(".rightMenu").bind('click', {}, cargas);
	$(".btnOk").bind('click', {}, cargas);
	
	var media,place;
	
	var iframe = $(".media");
	iframe.load(function () {
		iframe.contents().find('img').each(function () {
			$(this).css("width","100%");
			$(this).css("height","auto");
			$(this).on('click', function (event) {
				if(media != null){
					$(this).fadeOut();
					document.getElementById(place).src = media+"?autoplay=1";
					document.getElementById(place).style.width = "50% !important";
					document.getElementById(place).style.height = "50vh !important";

				}
			});

		$(this).hover(function () {
			if(media != null){
				$(this).css("cursor","pointer");
			}
			});
		});
	});
	
	
	console.log(datosInfo)

	
	function cargas(event){
		$(".menuInfo").fadeOut();
		$(".boxShow").show();
	
		if(this.className == 'rightMenu info' || this.className == 'btnOk info' ){
			var fichasInfo1 = event.target.getAttribute("data-index");
			var fichasInfo2 = event.target.getAttribute("data-image");
			media = event.target.getAttribute("data-media");
			place = "spot1";
			infoCharge(fichasInfo2,fichasInfo1);
		}
		if(this.className=='rightMenu learn'|| this.className == 'btnOk learn'){
			var fichasLearn1 = event.target.getAttribute("data-index");
			var fichasLearn2 = event.target.getAttribute("data-image");
			media = event.target.getAttribute("data-media");
			place = "spot2";
			learnCharge(fichasLearn2,fichasLearn1);
		}
		if(this.className=='rightMenu fun'|| this.className == 'btnOk fun'){
			var fichasFun1 = event.target.getAttribute("data-index");
			var fichasFun2 = event.target.getAttribute("data-image");
			media = event.target.getAttribute("data-media");
			place = "spot3";
			funCharge(fichasFun2,fichasFun1);
			
		}
		if(this.className=='rightMenu site' || this.className=='leftMenu site'){
			var site1 = event.target.getAttribute("data-text");
			var site2 = event.target.getAttribute("data-url");
			siteCharge(site1,site2);
		}
	}
    function infoCharge(infok,ficha){
		document.getElementById("spot1").src = "../images/info/"+infok+".jpg";
		document.getElementById("descriptorInfo2").innerHTML = "Description:   " + datosInfo[ficha].productDescription;
		document.getElementById("descriptorInfo3").innerHTML = "Technology:   " + datosInfo[ficha].technology;
	}
    function learnCharge(learnk,ficha){
		document.getElementById("spot2").src = "../images/edu/"+learnk+".jpg";
		document.getElementById("descriptorLearn2").innerHTML = "Description:  " + datosEdu[ficha].productDescription;
		document.getElementById("descriptorLearn3").innerHTML = "Technology:  " + datosEdu[ficha].technology;
	}
    function funCharge(funk,ficha){
		
		document.getElementById("spot3").src = "../images/enter/"+funk+".jpg";
		document.getElementById("descriptorFun2").innerHTML = "Description:  " + datosFun[ficha].productDescription;
		document.getElementById("descriptorFun3").innerHTML = "Technology:  " + datosFun[ficha].technology
	}
	function siteCharge(ficha,url){
		
		document.getElementById("spot3").src = "../sections/"+url+".html";
		document.getElementById("descriptorFun1").innerHTML = "Company:  " + datosFun[ficha].company;
		document.getElementById("descriptorFun2").innerHTML = "Description:  " + datosFun[ficha].productDescription;
		document.getElementById("descriptorFun3").innerHTML = "Technology:  " + datosFun[ficha].technology;
	}
	$(".boxShow").click(function(){
		
		$(".menuInfo").fadeIn();
		$(".boxShow").hide();
		var iframe1 = document.getElementById('spot1');
		iframe1.src = "";
		var iframe2 = document.getElementById('spot2');
		iframe2.src = "";
		var iframe3 = document.getElementById('spot3');
		iframe3.src = "";
	});
});