// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

  // Global Variables
  let canvas;
  let gl;
  let a_Position;
  let u_FragColor;
  let u_Size;
  let u_ModelMatrix;
  let u_GlobalRotateMatrix;
  let g_globalAngleX = 0;
  let g_globalAngleY = 0;
  let isDragging = false;
  let lastMouseX = null;
  let lastMouseY = null;

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

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  //get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// globals related to UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
let g_globalAngle=0;
let g_yellowAngle=0;
let g_magentaAngle=-180;
let g_yellowAnimation=false;
let g_magentaAnimation=false;
let g_leftArmLowerAngle=0;
let g_rightArmUpperAngle=0;
let g_rightArmLowerAngle=0;
let g_rightLegAngle=-180;
let g_leftLegAngle=-180;
let g_leftArmLowerAnimation=false;
let g_rightArmUpperAnimation=false;
let g_rightArmLowerAnimation=false;
let g_rightLegAnimation=false;
let g_leftLegAnimation=false;
let g_leftHandAngle=0;
let g_leftHandAnimation=false;
let g_rightHandAngle=0;
let g_rightHandAnimation=false;

// set up actions fro html ui elements
function addActionsForHtmlUI(){
  //button events
  document.getElementById('animationYellowOnButton').onclick = function() {
    g_yellowAnimation=true;
  }

  document.getElementById('animationYellowOffButton').onclick = function() {
    g_yellowAnimation=false;
  }

  document.getElementById('animationMagentaOnButton').onclick = function() {
    g_magentaAnimation=true;
  }

  document.getElementById('animationMagentaOffButton').onclick = function() {
    g_magentaAnimation=false;
  }

  document.getElementById('yellowSlide').addEventListener('mousemove', function() {
    g_yellowAngle = this.value;
    renderScene();
  });

  document.getElementById('magentaSlide').addEventListener('mousemove', function() {
    g_magentaAngle = this.value;
    renderScene();
  });

  document.getElementById('leftArmLowerSlide').addEventListener('mousemove', function() {
    g_leftArmLowerAngle = this.value;
    renderScene();
  });

  document.getElementById('leftHandSlide').addEventListener('mousemove', function() {
    g_leftHandAngle = this.value;
    renderScene();
  });

  document.getElementById('rightArmUpperSlide').addEventListener('mousemove', function() {
    g_rightArmUpperAngle = this.value;
    renderScene();
  });

  document.getElementById('rightArmLowerSlide').addEventListener('mousemove', function() {
    g_rightArmLowerAngle = this.value;
    renderScene();
  });

  document.getElementById('rightHandSlide').addEventListener('mousemove', function() {
    g_rightHandAngle = this.value;
    renderScene();
  });

  document.getElementById('rightLegSlide').addEventListener('mousemove', function() {
    g_rightLegAngle = this.value;
    renderScene();
  });

  document.getElementById('leftLegSlide').addEventListener('mousemove', function() {
    g_leftLegAngle = this.value;
    renderScene();
  });

  document.getElementById('animationLeftArmLowerOnButton').onclick = function() {
    g_leftArmLowerAnimation=true;
  }

  document.getElementById('animationLeftArmLowerOffButton').onclick = function() {
    g_leftArmLowerAnimation=false;
  }

  document.getElementById('animationLeftHandOnButton').onclick = function() {
    g_leftHandAnimation=true;
  }

  document.getElementById('animationLeftHandOffButton').onclick = function() {
    g_leftHandAnimation=false;
  }

  document.getElementById('animationRightArmUpperOnButton').onclick = function() {
    g_rightArmUpperAnimation=true;
  }

  document.getElementById('animationRightArmUpperOffButton').onclick = function() {
    g_rightArmUpperAnimation=false;
  }

  document.getElementById('animationRightArmLowerOnButton').onclick = function() {
    g_rightArmLowerAnimation=true;
  }
  document.getElementById('animationRightHandOffButton').onclick = function() {
    g_rightHandAnimation=false;
  }

  document.getElementById('animationRightHandOnButton').onclick = function() {
    g_rightHandAnimation=true;
  }

  document.getElementById('animationRightArmLowerOffButton').onclick = function() {
    g_rightArmLowerAnimation=false;
  }

  document.getElementById('animationRightLegOnButton').onclick = function() {
    g_rightLegAnimation=true;
  }

  document.getElementById('animationRightLegOffButton').onclick = function() {
    g_rightLegAnimation=false;
  }

  document.getElementById('animationLeftLegOnButton').onclick = function() {
    g_leftLegAnimation=true;
  }

  document.getElementById('animationLeftLegOffButton').onclick = function() {
    g_leftLegAnimation=false;
  }

  //angle slider events
  document.getElementById('angleSlide').addEventListener('mousemove', function() {
    g_globalAngleY = this.value;
    renderScene();
  });
}

function main() {
  // set up canvas and gl vars
  setupWebGL();
  // set up GLSL shader programs and connect GLSL vars
  connectVariablesToGLSL();

  // set up actions for HTML UI elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function(ev) {
    isDragging = true;
    lastMouseX = ev.clientX;
    lastMouseY = ev.clientY;
  };
  //canvas.onmousemove = click;
  canvas.onmousemove = function(ev) {
    if (isDragging) {
      let deltaX = ev.clientX - lastMouseX;
      let deltaY = ev.clientY - lastMouseY;

      // Update global rotation angles based on mouse movement
      g_globalAngleY += deltaX * 0.5; // Rotate around Y-axis
      g_globalAngleX += deltaY * 0.5; // Rotate around X-axis

      // Clamp the X rotation to avoid flipping
      g_globalAngleX = Math.max(-90, Math.min(90, g_globalAngleX));

      // Update last mouse position
      lastMouseX = ev.clientX;
      lastMouseY = ev.clientY;

      // Re-render the scene
      renderScene();
    }
  };

  canvas.onmouseup = function() {
    isDragging = false;
  };

  canvas.onmouseleave = function() {
    isDragging = false;
  };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;
var g_lastFrameTime = performance.now();
var g_fps= 0;

// called by browser repeatedly whenever its time
function tick() {
  var currentTime = performance.now();
  var deltaTime = currentTime - g_lastFrameTime;
  g_lastFrameTime = currentTime;
  g_fps = 1000 / deltaTime;
  //save the current time
  g_seconds=currentTime/1000.0-g_startTime;

  updateAnimationAngles();

  //draw everything
  renderScene();

  sendTextToHTML("FPS: " + Math.floor(g_fps), "numdot");

  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  if (g_yellowAnimation) {
    g_yellowAngle = (15*Math.sin(g_seconds));
  }
  if (g_magentaAnimation) {
    g_magentaAngle = (20*Math.sin(3*g_seconds)) -30;
  }
  if (g_leftArmLowerAnimation) {
    g_leftArmLowerAngle = (-22.5*Math.cos(3*g_seconds)) + 22.5;
  }
  if (g_rightArmUpperAnimation) {
    g_rightArmUpperAngle = (5*Math.sin(3*g_seconds)) -5;
  }
  if (g_rightArmLowerAnimation) {
    g_rightArmLowerAngle = (-22.5*Math.sin(3*g_seconds)) + 22.5;
  }
  if (g_rightLegAnimation) {
    g_rightLegAngle = (-60*Math.sin(2*g_seconds)) +180;
  }
  if (g_leftLegAnimation) {
    g_leftLegAngle = (60*Math.sin(2*g_seconds)) - 180;
  }
  if (g_rightHandAnimation) {
    g_rightHandAngle = (-20* Math.sin(3*g_seconds));
  }
  if (g_leftHandAnimation) {
    g_leftHandAngle = (-20 * Math.sin(3*g_seconds));
  }
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
  renderScene();
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

function renderScene(){
  var globalRotMat = new Matrix4().rotate(g_globalAngleX,1,0,0).rotate(g_globalAngleY, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the body (blue)
  var body = new Cube();
  body.color = [0.0, 0.0, 1.0, 1.0]; // Blue body
  body.matrix.translate(-.25, -.25, 0.0);
  body.matrix.scale(0.5, .7, 0.25);
  body.render();

  // Draw the head (yellow face)
  var head = new Cylinder();
  head.color = [1.0, 1.0, 0.0, 1.0]; // Yellow face
  head.matrix.setTranslate(0, .45, 0.0);
  head.matrix.rotate(-g_yellowAngle, 1, 0, 0);
  head.matrix.scale(0.15, 0.3, .15); // Scale the head to be smaller than the body
  head.matrix.translate(-.10, 0, 0.6);
  head.render();

  // Draw left arm (2 joints)
  var leftArmUpper = new Cube();
  leftArmUpper.color = [1.0, 1.0, 0.0, 1.0]; // Red upper arm
  leftArmUpper.matrix.setTranslate(-.25, .4, -.05);
  leftArmUpper.matrix.rotate(0, 1, 0, 0);
  leftArmUpper.matrix.rotate(-g_magentaAngle, 0, 0, 1);
  var leftArmUpperCoordinatesMat=new Matrix4(leftArmUpper.matrix);
  leftArmUpper.matrix.scale(0.2, 0.5, 0.2); // Scale to arm size
  leftArmUpper.render();

  var leftArmLower = new Cube();
  leftArmLower.color = [1.0, 1.0, 0.0, 1.0];
  leftArmLower.matrix = leftArmUpperCoordinatesMat;
  leftArmLower.matrix.translate(0, .5, 0.001);
  leftArmLower.matrix.rotate(-g_leftArmLowerAngle, 0, 0, 1);
  leftArmLower.matrix.scale(0.2, .4, .2);
  leftArmLower.render();

  // Draw left hand
  var leftHand = new Cube();
  leftHand.color = [1.0, 1.0, 0.0, 1.0]; // Red hand
  leftHand.matrix = new Matrix4(leftArmLower.matrix); // Start from the lower arm's coordinates
  leftHand.matrix.translate(.2, 0.8, 0.001); // Position at the end of the lower arm
  leftHand.matrix.rotate(-g_leftHandAngle, 0, 0, 1); // Rotate the hand
  leftHand.matrix.translate(-0.2, 0, 0);
  leftHand.matrix.scale(1.01, 0.5, 1.05); // Scale to hand size
  leftHand.render();

  // Draw right arm (2 joints)
  var rightArmUpper = new Cube();
  rightArmUpper.color = [1.0, 1.0, 0.0, 1.0]; // Red upper arm
  rightArmUpper.matrix.setTranslate(.25, .4, .2);
  rightArmUpper.matrix.rotate(180,1,0,0);
  rightArmUpper.matrix.rotate(g_rightArmUpperAngle, 0, 0, 1); // Rotate the arm
  var rightArmUpperCoordinatesMat = new Matrix4(rightArmUpper.matrix); // Save coordinates for lower arm
  rightArmUpper.matrix.translate(0,0,0);
  rightArmUpper.matrix.scale(0.2, 0.5, 0.2); // Scale to arm size
  rightArmUpper.render();

  var rightArmLower = new Cube();
  rightArmLower.color = [1.0, 1.0, 0.0, 1.0]; // Yellow lower arm
  rightArmLower.matrix = rightArmUpperCoordinatesMat; // Start from the upper arm's coordinates
  rightArmLower.matrix.translate(0, .5, 0.001); // Position at the end of the upper arm
  rightArmLower.matrix.rotate(-g_rightArmLowerAngle, 0, 0, 1); // Rotate the lower arm
  rightArmLower.matrix.scale(0.2, .4, .2); // Scale to lower arm size
  rightArmLower.render();

  // Draw right hand
  var rightHand = new Cube();
  rightHand.color = [1.0, 1.0, 0.0, 1.0]; // Red hand
  rightHand.matrix = new Matrix4(rightArmLower.matrix); // Start from the lower arm's coordinates
  rightHand.matrix.translate(0.2, .8, 0.001); // Position at the end of the lower arm
  rightHand.matrix.rotate(-g_rightHandAngle, 0, 0, 1); // Rotate the hand
  rightHand.matrix.translate(-0.2, 0, 0);
  rightHand.matrix.scale(1.01, 0.5, 1); // Scale to hand size
  rightHand.render();

  var rightLeg = new Cube();
  rightLeg.color = [1.0, 1.0, 0.0, 1.0];
  rightLeg.matrix.setTranslate(.05,-.1, 0.25);
  rightLeg.matrix.translate(0, -0.05, 0);
  rightLeg.matrix.rotate(g_rightLegAngle, 1, 0, 0);
  rightLeg.matrix.translate(0, 0.05, 0);
  rightLeg.matrix.scale(.20, .7, .251);
  rightLeg.render();

  var leftLeg = new Cube();
  leftLeg.color = [1.0, 1.0, 0.0, 1.0];
  leftLeg.matrix.setTranslate(-.25,-.1,0.25);
  leftLeg.matrix.translate(0, -0.05, 0);
  leftLeg.matrix.rotate(g_leftLegAngle, 1, 0, 0);
  leftLeg.matrix.translate(0, 0.05, 0);
  leftLeg.matrix.scale(.20, .7, .251);
  leftLeg.render();


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
