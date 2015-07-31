var Starfield = (function() {
  var container;
  var windowWidth, windowHeight, windowHalfWidth, windowHalfHeight;
  var camera, scene, renderer;
  var starfield;
  var mouseX = 0, mouseY = 0;
  var starsLoaded = 0;

  function initialize(element) {
    container = ( typeof element === 'string') ? document.getElementById(element) : element;
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
    
    var starC = bvToRGB(Number(starData.data[0].ci));
    
    addStar(starfield, starX, starY, starZ, starC);
    
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

  // this function adapted from code at: http://stackoverflow.com/questions/21977786/star-b-v-color-index-to-apparent-rgb-color
  // by Spektre
  function bvToRGB(bv) {
//    var r, g, b;
//    var starR, starG, starB;
//    var t;
    var color;
    
    // bounds checking
//    if (bv < -0.4) { bv = -0.4; }
//    if (bv >  2.0) { bv =  2.0; }
    
    // this lookup table taken from: http://www.vendian.org/mncharity/dir3/starcolor/details.html
    if                      ((bv < -.40)) { color = 0x9bb2ff; }
    else if ((bv >= -.40) && (bv < -.35)) { color = 0x9eb5ff; }
    else if ((bv >= -.35) && (bv < -.30)) { color = 0xa3b9ff; }
    else if ((bv >= -.30) && (bv < -.25)) { color = 0xaabfff; }
    else if ((bv >= -.25) && (bv < -.20)) { color = 0xb2c5ff; }
    else if ((bv >= -.20) && (bv < -.15)) { color = 0xbbccff; }
    else if ((bv >= -.15) && (bv < -.10)) { color = 0xc4d2ff; }
    else if ((bv >= -.10) && (bv < -.05)) { color = 0xccd8ff; }
    else if ((bv >= -.05) && (bv < 0.00)) { color = 0xd3ddff; }
    else if ((bv >= 0.00) && (bv < 0.05)) { color = 0xdae2ff; }
    else if ((bv >= 0.05) && (bv < 0.10)) { color = 0xdfe5ff; }
    else if ((bv >= 0.10) && (bv < 0.15)) { color = 0xe4e9ff; }
    else if ((bv >= 0.15) && (bv < 0.20)) { color = 0xe9ecff; }
    else if ((bv >= 0.20) && (bv < 0.25)) { color = 0xeeefff; }
    else if ((bv >= 0.25) && (bv < 0.30)) { color = 0xf3f2ff; }
    else if ((bv >= 0.30) && (bv < 0.35)) { color = 0xf8f6ff; }
    else if ((bv >= 0.35) && (bv < 0.40)) { color = 0xfef9ff; }
    else if ((bv >= 0.40) && (bv < 0.45)) { color = 0xfff9fb; }
    else if ((bv >= 0.45) && (bv < 0.50)) { color = 0xfff7f5; }
    else if ((bv >= 0.50) && (bv < 0.55)) { color = 0xfff5ef; }
    else if ((bv >= 0.55) && (bv < 0.60)) { color = 0xfff3ea; }
    else if ((bv >= 0.60) && (bv < 0.65)) { color = 0xfff1e5; }
    else if ((bv >= 0.65) && (bv < 0.70)) { color = 0xffefe0; }
    else if ((bv >= 0.70) && (bv < 0.75)) { color = 0xffeddb; }
    else if ((bv >= 0.75) && (bv < 0.80)) { color = 0xffedb6; }
    else if ((bv >= 0.80) && (bv < 0.85)) { color = 0xffe9d2; }
    else if ((bv >= 0.85) && (bv < 0.90)) { color = 0xffe8ce; }
    else if ((bv >= 0.90) && (bv < 0.95)) { color = 0xffe6ca; }
    else if ((bv >= 0.95) && (bv < 1.00)) { color = 0xffe5c6; }
    else if ((bv >= 1.00) && (bv < 1.05)) { color = 0xffe3c3; }
    else if ((bv >= 1.05) && (bv < 1.10)) { color = 0xffe2bf; }
    else if ((bv >= 1.10) && (bv < 1.15)) { color = 0xffe0bb; }
    else if ((bv >= 1.15) && (bv < 1.20)) { color = 0xffdfb8; }
    else if ((bv >= 1.20) && (bv < 1.25)) { color = 0xffddb4; }
    else if ((bv >= 1.25) && (bv < 1.30)) { color = 0xffdbb0; }
    else if ((bv >= 1.30) && (bv < 1.35)) { color = 0xffdaad; }
    else if ((bv >= 1.35) && (bv < 1.40)) { color = 0xffd8a9; }
    else if ((bv >= 1.40) && (bv < 1.45)) { color = 0xffd6a5; }
    else if ((bv >= 1.45) && (bv < 1.50)) { color = 0xffd5a1; }
    else if ((bv >= 1.50) && (bv < 1.55)) { color = 0xffd29c; }
    else if ((bv >= 1.55) && (bv < 1.60)) { color = 0xffd096; }
    else if ((bv >= 1.60) && (bv < 1.65)) { color = 0xffcc8f; }
    else if ((bv >= 1.65) && (bv < 1.70)) { color = 0xffc885; }
    else if ((bv >= 1.70) && (bv < 1.75)) { color = 0xffc178; }
    else if ((bv >= 1.75) && (bv < 1.80)) { color = 0xffb765; }
    else if ((bv >= 1.80) && (bv < 1.85)) { color = 0xffa94b; }
    else if ((bv >= 1.85) && (bv < 1.90)) { color = 0xff9523; }
    else if ((bv >= 1.90) && (bv < 1.95)) { color = 0xff7b00; }
    else if ((bv >= 1.95))                { color = 0xff5200; }

    return returnColor = new THREE.Color(color);;
  }
    
  function createStar(ctx, color) {
//    console.log(color);
    var r = Math.round(color.r * 255);
    var g = Math.round(color.g * 255);
    var b = Math.round(color.b * 255);
      
    var gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0,    'rgba('+r+','+g+','+b+',.8)' );
//    gradient.addColorStop(0.2,  'rgba(0,128,128,.6)' );
    gradient.addColorStop(0.4,  'rgba('+r+','+g+','+b+',.6)' );
    gradient.addColorStop(0.6,  'rgba('+r+','+g+','+b+',.4)' );
    gradient.addColorStop(1,    'rgba(0,0,0,.2)' );

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
  }

  function addStar(group, x, y, z, color) {
    var celObj;
    var material = new THREE.ParticleCanvasMaterial({
        color: 0xffffff,
        program: function(ctx) {
            createStar(ctx, color)
        }});

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
