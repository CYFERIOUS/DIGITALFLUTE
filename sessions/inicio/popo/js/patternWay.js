

var Module = (function () {

  //for render scene
	var scene, camera, renderer;


  //for create objects

  var geometry, geometro, floor, geometry2, material,  mesh, sphere, axis, light, ambient, spotLight1;
  var material2 = [];
  var geometrical = [];

  var cubeGenerator = function(sizeX,sizeY,sizeZ){



        geometry = new THREE.BoxGeometry( sizeX, sizeY, sizeZ );

        var meshMaterial = new THREE.MeshLambertMaterial( {
                    color: 0xffffff,
                    opacity: 0.1,
                    transparent: true
        });

        //nesting cubes
       geometro = new THREE.Mesh( geometry, meshMaterial );


       

        console.log(geometry)

        geometro.position.x = 0;
        geometro.position.y = 0;
        geometro.position.z = 0;

        geometrical.push (geometro);

        scene.add(geometro);

        


  }



  var init = function (message) {
 

    	scene = new THREE.Scene();

        scene.background = new THREE.Color( 0x909EAD );
        
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

        camera.position.z = 5000;
 
     

        geometry2 = new THREE.SphereGeometry( 300, 10, 10 );
       

        //material = new THREE.MeshBasicMaterial( { ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 } );
        material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture( 'images/crate.jpg' ) } );
        
        //material2.push( new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true } ));
        material2.push( new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.SmoothShading } ) );
        material2.push( new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900,emissive: 0xff0000, shininess: 90, shading: THREE.FlatShading } ) );

      
        sphere = new THREE.Mesh( geometry2, material2 );

     
        
        axis = new THREE.AxisHelper( 500 );
        axis.position.set( 0, 0, 0 );

    

        scene.add( new THREE.AmbientLight( 0x222222 ) );

     

        var hemi = new THREE.HemisphereLight( 0xffffff, 0xFF0000, 1 );
        //scene.add( hemi );

        var pointsA = new THREE.PointLight( 0xffffff, 10 , 20 , 0 );
        pointsA.power = (2 * (9*3.1416));
        pointsA.position.set( 3000, 800, 0 );

        var pointsB = new THREE.PointLight( 0x175fe0, 10 , 20 , 0 );
        pointsB.power = (9 * (9*3.1416));
        pointsB.position.set( -3000, -800, 0 );

        scene.add( pointsA );
        scene.add( pointsB );
        
        var width = 200;
        var height = 1000;
        var rectLight = new THREE.RectAreaLight( 0xffffff, undefined,  width, height );
        rectLight.intensity = 500.0;
        rectLight.matrixAutoUpdate = true;
        rectLight.position.set( 0, 1, 0 );
        //scene.add( rectLight );

        rectLightHelper = new THREE.RectAreaLightHelper( rectLight );
        //scene.add( rectLightHelper );



        sphere.position.x = 0;


       for(var i = 100; i<=2000; i++){
            if (i == 200){
                cubeGenerator(i,i,i);
            }
            if (i == 400){
                cubeGenerator(i,i,i);
            }
            if (i == 600){
                 cubeGenerator(i,i,i);
            }
            if (i == 800){
                cubeGenerator(i,i,i);
            }
            if (i == 1000){
                cubeGenerator(i,i,i);
            }
            if (i == 1100){
                cubeGenerator(i,i,i);
            }
            if (i == 1200){
                cubeGenerator(i,i,i);
            }
            if (i == 1300){
                cubeGenerator(i,i,i);
            }
            if (i == 1400){
                cubeGenerator(i,i,i);
            }
            if (i == 1500){
                cubeGenerator(i,i,i);
            }
            if (i == 1600){
                cubeGenerator(i,i,i);
            }
            if (i == 1700){
                cubeGenerator(i,i,i);
            }
            if (i == 1800){
                cubeGenerator(i,i,i);
            }
            if (i == 1900){
                cubeGenerator(i,i,i);
            }
            if (i == 2000){
                cubeGenerator(i,i,i);
            }
           
       }
        
        
        //scene.add( sphere );
        //scene.add( axis );

 
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
 
        document.body.appendChild( renderer.domElement );
  };

   var animate = function (message) {
   		requestAnimationFrame( animate );

        
        for (var i = 0; i<15; i++){
            if(i==0){
                geometrical[0].rotation.x += 0.001;
                geometrical[0].rotation.y += 0.002;
            }
            if(i==1){
                geometrical[1].rotation.x += 0.003;
                geometrical[1].rotation.y += 0.004;
            }
            if(i==2){
                geometrical[2].rotation.x += 0.005;
                geometrical[2].rotation.y += 0.006;
            }
            if(i==3){
                geometrical[3].rotation.x += 0.007;
                geometrical[3].rotation.y += 0.008;
            }
            if(i==4){
                geometrical[4].rotation.x += 0.009;
                geometrical[4].rotation.y += 0.010;
            }
            if(i==5){
                geometrical[5].rotation.x += 0.011;
                geometrical[5].rotation.y += 0.012;
            }
            if(i==6){
                geometrical[6].rotation.x += 0.013;
                geometrical[6].rotation.y += 0.014;
            }
            if(i==7){
                geometrical[7].rotation.x += 0.015;
                geometrical[7].rotation.y += 0.016;
            }
            if(i==8){
                geometrical[8].rotation.x += 0.017;
                geometrical[8].rotation.y += 0.018;
            }
            if(i==9){
                geometrical[9].rotation.x += 0.018;
                geometrical[9].rotation.y += 0.019;
            }
            if(i==10){
                geometrical[10].rotation.x += 0.020;
                geometrical[10].rotation.y += 0.021;
            }
            if(i==11){
                geometrical[11].rotation.x += 0.022;
                geometrical[11].rotation.y += 0.023;
            }
            if(i==12){
                geometrical[12].rotation.x += 0.024;
                geometrical[12].rotation.y += 0.025;
            }
            if(i==13){
                geometrical[13].rotation.x += 0.026;
                geometrical[13].rotation.y += 0.027;
            }
            if(i==14){
                geometrical[14].rotation.x += 0.028;
                geometrical[14].rotation.y += 0.029;
            }
            if(i==15){
                geometrical[15].rotation.x += 0.030;
                geometrical[15].rotation.y += 0.031;
            }
            
           
        }
        
        
        //sphere.rotation.x += 0.01;
        //sphere.rotation.y += 0.02;
        renderer.render( scene, camera );
   }


   var publicMethod = function () {
    if (Detector.webgl) {
    init();
    animate();
    } else {
      alert("no canciona");
    }  
  };
  
  
  return {
    publicMethod: publicMethod
  };

})();

$(function() {

  Module.publicMethod();
});


