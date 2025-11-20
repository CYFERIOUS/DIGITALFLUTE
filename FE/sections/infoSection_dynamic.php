<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
<script src="../bower_components/jquery/dist/jquery.min.js" type="text/javascript"></script>
<script src="../js/async.js" type="text/javascript"></script>
<script src="../js/translate.js" type="text/javascript"></script>


<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Information</title>
<link href="../css/flutest.css" rel="stylesheet" type="text/css" />
<link href="../css/menu.css" rel="stylesheet" type="text/css" />
</head>
<body>
 <div class="boxShow"><iframe class="media"  id="spot1" src = "" frameborder="0" scrolling="no" allowfullscreen ></iframe>
	 <div class="dataDesc"> 
		 <div id="descriptorInfo1" class="descriptors"></div>
		 <div id="descriptorInfo2" class="descriptors"></div>
		 <div id="descriptorInfo3" class="descriptors"></div>
		<a>&#129172; back to menu</a></div>
	 </div>
 
  <div class="menuInfo">
 	<div class="scrollerTittle"><a>Scroll and click image to see info</a></div>
	  	
      <?php
        $apiUrl = 'http://localhost:5000/info';
        
        // Try cURL first (more reliable), fallback to file_get_contents
        if (function_exists('curl_init')) {
          $ch = curl_init();
          curl_setopt($ch, CURLOPT_URL, $apiUrl);
          curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
          curl_setopt($ch, CURLOPT_TIMEOUT, 5);
          curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
          $json = curl_exec($ch);
          $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
          curl_close($ch);
          
          if ($json === false || $httpCode !== 200) {
            $json = false;
          }
        } else {
          $context = stream_context_create([
            'http' => [
              'method' => 'GET',
              'header' => 'Accept: application/json',
              'timeout' => 5
            ]
          ]);
          $json = @file_get_contents($apiUrl, false, $context);
        }
        
        if ($json === false) {
          echo '<div class="error-message">Error: Could not connect to API at ' . htmlspecialchars($apiUrl) . '. Please ensure the backend server is running on port 5000.</div>';
        } else {
          $projects = json_decode($json, true);
          
          if (json_last_error() !== JSON_ERROR_NONE) {
            echo '<div class="error-message">Error: Invalid JSON response from API. ' . json_last_error_msg() . '</div>';
          } elseif (empty($projects)) {
            echo '<div class="info-message">No information data available.</div>';
          } else {
            foreach ($projects as $project) {
              echo '<div class="container">';
              echo '<div class="rightMenu info" data-media="' . htmlspecialchars($project["media"] ?? '') . '" data-index="' . htmlspecialchars($project["index"] ?? '') . '" data-image="' . htmlspecialchars($project["image"] ?? '') . '">' . htmlspecialchars($project["description"] ?? '') . '<br><a class="imageClick">click  please.</a></div>';
              echo '<div class="leftMenu" ><input type="image" class="btnOk info" data-index="' . htmlspecialchars($project["index"] ?? '') . '" data-image="' . htmlspecialchars($project["image"] ?? '') . '"  src="' . htmlspecialchars($project["thumb"] ?? '') . '"  name="' . htmlspecialchars($project["name"] ?? '') . '" width="228" height="120" border="0" /></div>';
              echo '</div>';
            }
          }
        }
      ?>
   </div>
</body>
</html>