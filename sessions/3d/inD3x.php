<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>3D PORTFOLIO</title>

<script src="../../bower_components/jquery/dist/jquery.min.js" type="text/javascript"></script>
<script src="../../bower_components/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>

<script src="js/filter.js" type="text/javascript"></script>
	<script src="js/scriptos.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="css/style.css"/>
</head>

<body>
<div id="header">
<div id="menu">
	<h2>DIGITAL FLUTE 3D PORTFOLIO</h2>
    <input id="search" style="float:right"type="text" placeholder="search"/>
</div>
</div>
<div id="overlay"></div>

<div id="frame">
 
	<div alt="img"><iframe id="main" src="" width="500" height="500" ></iframe> </div>
  
    <table id="frame-arrows">
	
    <tr>
		<td id="left">
        	<img src="images/flechas2.png" alt="left"/>
        </td>
        <td><div id="description">
    <p>  </p>
    </div></td>
		<td id="right">
        	<img src="images/flechas.png" alt="right"/>
        </td>
	</tr>
   
</table>

</div>

<div id="wraper">
<ul id="filter">
	<li class="active">ALL</li>
	<li>CYBERPUNK</li>
	<li>HORROR</li>
    <li>KIDS</li>
    <li>ONIRICAL</li>
</ul>
<ul id="portfolio">
	<?php include_once("list.html") ?>
</ul>
</div>
</body>
</html>