// JavaScript Document
// JavaScript Document
$(function(){
	
	var current_li;
	
	$("#search").keyup(function(){
		
		var query = $(this).val();
		
		if(query != ""){
		$("#portfolio li").hide();
		$("#portfolio li").each(function() {
            var current = $(this).attr("data-keywords");
			if(current.indexOf(query)>=0){
				$(this).show();
			}
        });
		}else{
			$("#portfolio li").show();
		}
		
	});
	
	////sort images with ajaxs post method. 
	$("#portfolio").sortable({stop:
		function(){
		var list_cont = $("#portfolio").html();
		$.post("charge.php",{list:list_cont});
		}
		});
		
	/////shoot images into main div.	
	function getIMG(src,id){
		var path = event.target.getAttribute("data-path");
		$("#main").attr("src",path);
		
		var path = "texto/"+id+".txt";
		$.get(path,function(data){
			console.log(data);
			$("#description p").html(data);
		});
	}
	
	
	
	////active the greybox every time you click on image
	
	$("#portfolio img").click(function(){
	
		var src = $(this).attr("src");
		var id = $(this).attr("id");
		current_li = $(this).parent();
		getIMG(src,id);
		$("#frame").fadeIn();
		$("#overlay").fadeIn();
	
	});
	
	$("#overlay").click(function(){
		$(this).fadeOut();
		$("#frame").fadeOut();
		
	});
	
	$("#right").click(function(){
	
		if(current_li.is(":last-child")){
			var next_li = $("#portfolio li").first();
		}else{
			  var next_li = current_li.next();
		}
		
		var next_src = next_li.children("img").attr("src");
		var id = next_li.children("img").attr("id");
		getIMG(next_src,id);
		current_li = next_li;
	});
	
	$("#left").click(function(){
		
		if(current_li.is(":first-child")){
			var prev_li = $("#portfolio li").last();
		}else{
			var prev_li = current_li.prev();
		}
		
		
		var prev_src = prev_li.children("img").attr("src");
		var id = prev_li.children("img").attr("id");
		getIMG(prev_src,id);
		current_li = prev_li;
	});
	
});
