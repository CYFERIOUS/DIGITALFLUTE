<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>3D PORTFOLIO</title>

<!--<script src="../../bower_components/jquery/dist/jquery.min.js" type="text/javascript"></script>
<script src="../../bower_components/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>-->

	<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>


<script src="js/filter.js" type="text/javascript"></script>
	<script src="js/scriptos.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="css/style.css"/>
</head>

<body>
 <div id="overlay"></div>
<input id="search" style="float:right; right: 20px" type="text" placeholder="search"/>


<div id="frame">
 
	<div alt="img"><iframe id="main" src="" width="100%" height="400px" ></iframe> </div>

</div>

<div id="wraper">
<ul id="filter">
	3D MODELS 
	<li class="active">ALL</li>
	<li>VIDEO GAMES</li>
	<li>ARCHITECTURE</li>
    <li>PRODUCT</li>
    <li>ANIMATION</li>
</ul>
<ul id="portfolio">
	<?php include_once("list.html") ?>
</ul>
</div>
</body>
</html>