var Starfield = (function() {
  var container;
  var windowWidth, windowHeight, windowHalfWidth, windowHalfHeight;
  var camera, scene, renderer;
  var starfield;
  var mouseX = 0, mouseY = 0;
  var starsLoaded = 0;

  function initialize(element) {
    container = ( typeof element == 'string') ? document.getElementById(element) : element;
    measure();
    setupCamera();
    setupScene();
    createRenderer();

    // Event listeners
    $(document).mousemove(onMouseMove);
    $(window).resize(onResize);
  }

  function measure() {
    windowWidth       = window.innerWidth;
    windowHeight      = window.innerHeight;
    windowHalfWidth   = window.innerWidth / 2;
    windowHalfHeight  = window.innerHeight / 2;
  }

  function setupCamera() {
     if ( !camera ) {
      camera = new THREE.Camera( 75, windowWidth / windowHeight, 1, 3000 );
      camera.position.z = 1000;
     }
  }

  function setupScene() {
    if ( !scene ) {
      starfield = new THREE.Object3D();
      
      scene = new THREE.Scene();
      scene.addObject( starfield );

      Papa.parse("http://maxmahem.net/starfield/hygdata_v3-nearestfirst.csv", {
        header: true,
        preview: 10000,
	download: true,
        worker: true,
        fastmode: true, // we can use this because there are no quotes in our data file.
	step: addStarToScene
        });
    }
  }
  
  function addStarToScene(starData) {
//    console.log(starData.data[0]);
    var starX = Number(starData.data[0].x) * 100;
    var starY = Number(starData.data[0].y) * 100;
    var starZ = Number(starData.data[0].z) * 100;
    
    addStar(starfield, starX, starY, starZ);
    
    starsLoaded = starsLoaded + 1;
//    console.log(starsLoaded);
    
    $("#progress").text(starsLoaded + " stars loaded");
  }

  function createRenderer() {
    if ( !renderer ) {
      renderer = new THREE.CanvasRenderer();
      renderer.setSize(windowWidth, windowHeight);
      container.appendChild(renderer.domElement);
    }
  }

  function createStar(ctx) {
    var gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0,    'rgba(255,255,255,.8)' );
    gradient.addColorStop(0.2,  'rgba(0,128,128,.6)' );
    gradient.addColorStop(0.4,  'rgba(0,0,128,.6)' );
    gradient.addColorStop(0.6,  'rgba(0,0,64,.4)' );
    gradient.addColorStop(1,    'rgba(0,0,0,.2)' );

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
  }

  function createRedDwarf(ctx) {
    var gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0,    'rgba(255,255,255,.8)' );
    gradient.addColorStop(0.2,  'rgba(128,128,0,.6)' );
    gradient.addColorStop(0.4,  'rgba(128,0,0,.6)' );
    gradient.addColorStop(0.6,  'rgba(64,0,0,.4)' );
    gradient.addColorStop(1,    'rgba(0,0,0,.2)' );

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
  }

  function addStar(group, x, y, z) {
    var celObj;
    var material = new THREE.ParticleCanvasMaterial({color: 0xffffff, program: createStar});

    celObj = new THREE.Particle(material);
    celObj.position.x = x;
    celObj.position.y = y;
    celObj.position.z = z;
    celObj.scale.x = celObj.scale.y = Math.random() * 2;

    group.addChild(celObj);
  }

  // ---------------------------------------------------------------------------
  // -- Event Handlers ---------------------------------------------------------
  // ---------------------------------------------------------------------------

  function onMouseMove(e) {
    mouseX = e.clientX - windowHalfWidth;
    mouseY = e.clientY - windowHalfHeight;
  }

  function onResize() {
    measure();

    if ( camera )
      camera.aspect = windowWidth / windowHeight;

    if ( renderer )
      renderer.setSize(windowWidth, windowHeight);
  }

  // ---------------------------------------------------------------------------

  function animate() {
    requestAnimationFrame( animate );
    render();
  }

  function render() {
    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

//    starfield.rotation.x += 0.005;
//    starfield.rotation.y += 0.01;

    renderer.render( scene, camera );
  }

  // ---------------------------------------------------------------------------

  return {
    initialize: initialize,
    startAnimation: animate
  }
})();

$(document).ready(function() {
  Starfield.initialize('main');
  Starfield.startAnimation();
});
