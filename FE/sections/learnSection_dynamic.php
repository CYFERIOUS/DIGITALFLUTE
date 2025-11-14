
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<script src="../bower_components/jquery/dist/jquery.min.js" type="text/javascript"></script>
<script src="../js/async.js" type="text/javascript"></script>
<script src="../js/translate.js" type="text/javascript"></script>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Education</title>
<link href="../css/flutest.css" rel="stylesheet" type="text/css" />
<link href="../css/menu.css" rel="stylesheet" type="text/css" />
</head>
<body>
<div class="boxShow"><iframe class="media" id="spot2" src = "" frameborder="0" scrolling="no"></iframe>
	<div class="dataDesc"> 
		<div id="descriptorLearn1"  class="descriptors"></div>
		<div id="descriptorLearn2"  class="descriptors"></div>
		<div id="descriptorLearn3"  class="descriptors"></div>
		<a>&#129172; back to menu</a></div>
	</div>

<div  class="menuInfo">
 <div class="scrollerTittle"><a>Scroll and click image to see info</a></div>
 
    <?php
        $json = file_get_contents('http://localhost:5000/edu');
        $projects = json_decode($json, true);

        foreach ($projects as $project) {
            echo '<div class="container">';
            echo '<div class="rightMenu learn" data-media="' . htmlspecialchars($project["media"]) . '" data-index="' . htmlspecialchars($project["index"]) . '" data-image="' . htmlspecialchars($project["image"]) . '">' . htmlspecialchars($project["description"]) . '<br><a class="imageClick">click please.</a></div>';
            echo '<div class="leftMenu"><input type="image" class="btnOk learn" data-index="' . htmlspecialchars($project["index"]) . '" data-image="' . htmlspecialchars($project["image"]) . '" src="' . htmlspecialchars($project["thumb"]) . '" name="' . htmlspecialchars($project["name"]) . '" width="228" height="120" border="0" /></div>';
            echo '</div>';
        }
      ?>
   </div>
</body>
</html>
