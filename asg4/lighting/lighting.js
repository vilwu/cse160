// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  void main() {
    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal + 1.0)/2.0, 1.0);
    } else if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    } else if (u_whichTexture == 4) {
      gl_FragColor = texture2D(u_Sampler4, v_UV);
    } else {
      gl_FragColor = vec4(1, .2, .2, 1);
    }
    vec3 lightVector = u_lightPos-vec3(v_VertPos);
    float r = length(lightVector);

    //if (r<1.0) {
    //  gl_FragColor= vec4(1,0,0,1);
    //} else if (r<2.0) {
    //  gl_FragColor= vec4(0,1,0,1);
    //}

    //gl_FragColor= vec4(vec3(gl_FragColor)/(r*r),1);

    // N dot L
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    //reflection
    vec3 R = reflect(-L, N);

    //eye
    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

    //specular
    float specular = pow(max(dot(E,R), 0.0), 64.0) * 0.8;

    vec3 diffuse = vec3(1.0, 1.0, 0.9) * vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.2;
    if (u_lightOn) {
      if (u_whichTexture == 0) {
        gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
      } else {
        gl_FragColor = vec4(diffuse+ambient, 1.0);
      }
    }
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightOn;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program,'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }


  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage locatino of u_ViewMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return;
  }

  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return;
  }

  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const BRUSH = 3;

// globals related to UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
let g_globalAngle=0;
let g_yellowAngle=0;
let g_magentaAngle=0;
let g_yellowAnimation=false;
let g_magentaAnimation=false;
let g_normalOn=false;
let g_lightOn =true;
let g_lightPos=[0,1,-2];

// set up actions fro html ui elements
function addActionsForHtmlUI(){
  document.getElementById('normalOn').onclick = function() {g_normalOn = true;};
  document.getElementById('normalOff').onclick = function() {g_normalOn = false;};

  document.getElementById('lightOnButton').onclick = function() {g_lightOn = true;};
  document.getElementById('lightOffButton').onclick = function() {g_lightOn = false;};

  document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation = false;};
  document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation = true;};

  document.getElementById('animationMagentaOffButton').onclick = function() {g_magentaAnimation = false;};
  document.getElementById('animationMagentaOnButton').onclick = function() {g_magentaAnimation = true;};

  // Color SLider Events
  document.getElementById('yellowSlide').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_yellowAngle = this.value; renderAllShapes(); }});
  document.getElementById('magentaSlide').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) {g_magentaAngle = this.value; renderAllShapes(); }});

  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[0] = this.value/100; renderAllShapes(); }});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[1] = this.value/100; renderAllShapes(); }});
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[2] = this.value/100; renderAllShapes(); }});

  canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev) } }

  //Size slider events
  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); });
}

function  initTextures() {
  var image0 = new Image();
  if (!image0) {
    console.log('Failed to create the image object');
    return false;
  }
  image0.onload = function(){sendImageToTEXTURE0(image0); };
  image0.src = 'img/grass.jpg';

  //Add more texture loading
  var image1 = new Image();
  if (!image1) {
    console.log('Failed to create the image object');
    return false;
  }
  image1.onload = function(){sendImageToTEXTURE1(image1); };
  image1.src = 'img/minecraft sky.png';

  var image2 = new Image();
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }
  image2.onload = function(){sendImageToTEXTURE2(image2); };
  image2.src = 'img/zombie.png';

  var image3 = new Image();
  if (!image3) {
    console.log('Failed to create the image object');
    return false;
  }
  image3.onload = function(){sendImageToTEXTURE3(image3); };
  image3.src = 'img/creeper.jpg';

  var image4 = new Image();
  if (!image4) {
    console.log('Failed to create the image object');
    return false;
  }
  image4.onload = function(){sendImageToTEXTURE4(image4); };
  image4.src = 'img/enderman.png';

  return true;
}

function sendImageToTEXTURE0(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler0, 0);

  console.log('finished loadTexture');
}

function sendImageToTEXTURE1(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler1, 1);

  console.log('finished loadTexture');
}

function sendImageToTEXTURE2(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler2, 2);

  console.log('finished loadTexture');
}

function sendImageToTEXTURE3(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler3, 3);

  console.log('finished loadTexture');
}

function sendImageToTEXTURE4(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler4, 4);

  console.log('finished loadTexture');
}

function main() {
  // set up canvas and gl vars
  setupWebGL();
  // set up GLSL shader programs and connect GLSL vars
  connectVariablesToGLSL();

  // set up actions for HTML UI elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = click;
  //canvas.onmousemove = click;
  //canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev)} };

  document.onkeydown = keydown;

  initTextures();
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0 - g_startTime;

function tick() {
  g_seconds=performance.now()/1000.0-g_startTime;

  updateAnimationAngles();

  renderAllShapes();

  requestAnimationFrame(tick);
}

var g_shapesList = [];

function click(ev) {

  let [x,y] = convertCoordinatesEventToGL(ev);

  // create and store the new point
  let point;
  if (g_selectedType==POINT) {
    point = new Point();
  } else if (g_selectedType==TRIANGLE) {
    point = new Triangle();
  } else if (g_selectedType==CIRCLE) {
    point = new Circle();
  } else {
    point = new Brush();
  }
  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  g_shapesList.push(point);

  //Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function updateAnimationAngles() {
  if (g_yellowAnimation) {
    g_yellowAngle = (45 * Math.sin(g_seconds));
  }
  if (g_magentaAnimation) {
    g_magentaAngle = (45 * Math.sin(3*g_seconds));
  }

  //g_lightPos[0]=Math.cos(g_seconds);
}

function keydown(ev) {
  if (ev.keyCode == 68) { // D key (Right)
    g_camera.right();
  } else if (ev.keyCode == 65) { // A key (Left)
    g_camera.left();
  } else if (ev.keyCode == 87) { // W key (Forward)
    g_camera.forward();
  } else if (ev.keyCode == 83) { // S key (Backward)
    g_camera.back();
  } else if (ev.keyCode == 81) { // Q key (Rotate Left)
    g_camera.rotateLeft();
  } else if (ev.keyCode == 69) { // E key (Rotate Right)
    g_camera.rotateRight();
  }

  renderAllShapes();
}


var g_camera = new Camera();
var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
];

function drawMap() {
  for (x=0; x<32; x++) {
    for (y=0; y<32; y++) {
      //console.log(x,y);
      if (x==0 || x == 31 || y== 0 || y == 31) {
        var body = new Cube();
        body.color = [0.8, 1.0, 1.0, 1.0];
        body.textureNum = -2;
        body.matrix.translate(0, -.75, 0);
        body.matrix.scale(.3, .3, .3);
        body.matrix.translate(x-16, 0, y-16);
        body.render();
      }
    }
  }
}


function renderAllShapes(){

  // Check the time at the start of this function
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(50, 1*canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat=new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.x, g_camera.eye.y, g_camera.eye.z,
    g_camera.at.x, g_camera.at.y, g_camera.at.z,
    g_camera.up.x, g_camera.up.y, g_camera.up.z,
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Clear <canvas
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //drawMap();

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  gl.uniform3f(u_cameraPos, g_camera.eye.x, g_camera.eye.y, g_camera.eye.z);

  gl.uniform1i(u_lightOn, g_lightOn);

  //draw light
  var light=new Cube();
  light.color = [2,2,0,1];
  light.textureNum=-2;
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1, -.1, -.1);
  light.matrix.translate(-.5, -.5, -.5);
  light.render();

  //draw Sphere
  var sp = new Sphere();
  //sp.textureNum=-1;
  if (g_normalOn) sp.textureNum=-3;
  sp.matrix.translate(-1, 0.3, -1.5);
  //sp.matrix.sccale(.4,.4, .4);
  sp.render();

  // draw the floor
  var floor = new Cube();
  floor.color = [1.0, 0.0, 0.0, 1.0];
  floor.textureNum=0;
  if (g_normalOn) floor.textureNum=-3;
  floor.matrix.translate(0, -.75, 0.0);
  floor.matrix.scale(10, 0, 10);
  floor.matrix.translate(-.5, 0, -0.5);
  floor.render();

  var sky = new Cube();
  sky.color = [1.0, 0.0, 0.0, 1.0];
  sky.textureNum=1;
  if (g_normalOn) sky.textureNum=-3;
  sky.matrix.scale(-50,- 50, -50);
  sky.matrix.translate(-.5, -.5, -0.5);
  sky.render();

  var body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.textureNum=2;
  if (g_normalOn) body.textureNum=-3;
  body.matrix.translate(-.13, -.75, 0.0);
  //body.matrix.rotate(-5, 1, 0, 0)
  body.matrix.scale(0.3, .3, .3);
  //body.normalMatrix.setInverseOf(body.matrix).transpose();
  body.render();

  var yellow = new Cube();
  yellow.color = [1, 1, 0, 1];
  yellow.textureNum=3;
  if (g_normalOn) yellow.textureNum=-3;
  yellow.matrix.setTranslate(0,-.5, 0.0);
  //yellow.matrix.rotate(-5, 1, 0, 0);
  yellow.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  var yellowCoordinatesMat = new Matrix4(yellow.matrix);
  yellow.matrix.scale(.3, .3, .3);
  yellow.matrix.translate(-.45, .15, 0);
  //yellow.normalMatrix.setInverseOf(yellow.matrix).transpose();
  yellow.render();

  var magenta = new Cube();
  magenta.color = [1, 0, 1, 1];
  magenta.textureNum=4;
  if (g_normalOn) magenta.textureNum=-3;
  magenta.matrix = yellowCoordinatesMat;
  magenta.matrix.translate(0.015, 0.35, 0);
  magenta.matrix.rotate(-g_magentaAngle, 0, 0, 1);
  magenta.matrix.scale(.3, .3, .3);
  magenta.matrix.translate(-.5, 0, -.001);
  //magenta.normalMatrix.setInverseOf(magenta.matrix).transpose();
  magenta.render();

  // Check the time at the end of the function, and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML( " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

// Set the text of a HTML elements
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
