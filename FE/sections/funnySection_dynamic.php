
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<script src="../bower_components/jquery/dist/jquery.min.js" type="text/javascript"></script>
<script src="../js/async.js" type="text/javascript"></script>
<script src="../js/translate.js" type="text/javascript"></script>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Entertainment</title>
<link href="../css/flutest.css" rel="stylesheet" type="text/css" />
<link href="../css/menu.css" rel="stylesheet" type="text/css" />
</head>

<body>
<div class="boxShow"><iframe class="media" id="spot3" src = "" frameborder="0" scrolling="no"></iframe>
	<div class="dataDesc"> 
		<div id="descriptorFun1" class="descriptors"></div>
		<div id="descriptorFun2" class="descriptors"></div>
		<div id="descriptorFun3" class="descriptors"></div>
		<a>&#129172; back to menu</a></div>
	</div>
 
 <div class="menuInfo">
  <div  class="scrollerTittle"><a>Scroll and click image to see info</a></div>
 
    <?php
        $json = file_get_contents('http://localhost:5000/fun');
        $projects = json_decode($json, true);

        foreach ($projects as $project) {
            if (isset($project["url"])) {
                echo '<div class="container">';
                echo '<div class="rightMenu site" data-index="' . htmlspecialchars($project["index"]) . '" data-url="' . htmlspecialchars($project["url"]) . '">' . htmlspecialchars($project["description"]) . '<br><a class="imageClick">click please.</a></div>';
                echo '<div class="leftMenu site"><input type="image" class="btnOk site" data-index="' . htmlspecialchars($project["index"]) . '" data-url="' . htmlspecialchars($project["url"]) . '" src="' . htmlspecialchars($project["thumb"]) . '" name="' . htmlspecialchars($project["name"]) . '" width="228" height="120" border="0" id="' . htmlspecialchars($project["url"]) . '" /></div>';
                echo '</div>';
            } else {
                echo '<div class="container">';
                echo '<div class="rightMenu fun" data-media="' . htmlspecialchars($project["media"]) . '" data-index="' . htmlspecialchars($project["index"]) . '" data-image="' . htmlspecialchars($project["image"]) . '">' . htmlspecialchars($project["description"]) . '<br><a class="imageClick">click please.</a></div>';
                echo '<div class="leftMenu"><input type="image" class="btnOk fun" data-index="' . htmlspecialchars($project["index"]) . '" data-image="' . htmlspecialchars($project["image"]) . '" src="' . htmlspecialchars($project["thumb"]) . '" name="' . htmlspecialchars($project["name"]) . '" width="228" height="120" border="0" /></div>';
                echo '</div>';
            }
        }
      ?>
    </div>
</body>
</html>
