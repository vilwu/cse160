// asg0.js
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');
  if(!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return;
  }
  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');
  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set a blue color
  ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color

  // fill canvas with black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Create v1 of class Vector3
  let v1 = new Vector3([2.25, 2.25, 0]);
  let v2 = new Vector3([2.24, 2.25, 0]);

  // Define drawVector function
  function drawVector(v, color) {
    // go to center
    ctx.beginPath();
    ctx.moveTo(200, 200);

    ctx.lineTo(
      200 + v.elements[0] * 20,
      200 - v.elements[1] * 20
    );

    ctx.strokeStyle = color;
    ctx.stroke();
  }

  function handleDrawEvent() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // fill with black again
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // read inputs v1
    var x1 = parseFloat(document.getElementById("xCoord").value) || 0;
    var y1 = parseFloat(document.getElementById("yCoord").value) || 0;

    // read inputs v2
    var x2 = parseFloat(document.getElementById("xCoord2").value) || 0;
    var y2 = parseFloat(document.getElementById("yCoord2").value) || 0;

    // create new vector
    var v1 = new Vector3([x1, y1, 0]);
    var v2 = new Vector3([x2, y2, 0]);

    drawVector(v1, "red");
    drawVector(v2, "blue");
  }

  function handleDrawOperationEvent() {
    // Clear and reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // fill with black again
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // read inputs v1
    var x1 = parseFloat(document.getElementById("xCoord").value) || 0;
    var y1 = parseFloat(document.getElementById("yCoord").value) || 0;

    // read inputs v2
    var x2 = parseFloat(document.getElementById("xCoord2").value) || 0;
    var y2 = parseFloat(document.getElementById("yCoord2").value) || 0;

    // create new vector
    var v1 = new Vector3([x1, y1, 0]);
    var v2 = new Vector3([x2, y2, 0]);

    drawVector(v1, "red");
    drawVector(v2, "blue");
    // read operation and Scalar
    var operation = document.getElementById("operation").value;
    var scalar = parseFloat(document.getElementById("scalar").value) || 1;

    if (operation === "add") {
      var v3 = new Vector3([x1, y1, 0]).add(v2);
      drawVector(v3, "green");
    } else if (operation === "sub") {
      var v3 = new Vector3([x1, y1, 0]).sub(v2);
      drawVector(v3, "green");
    } else if (operation === "mul") {
      var v3 = new Vector3([x1, y1, 0]).mul(scalar);
      var v4 = new Vector3([x2, y2, 0]).mul(scalar);
      drawVector(v3, "green");
      drawVector(v4, "green");
    } else if (operation === "div") {
      if (scalar !== 0) {
      var v3 = new Vector3([x1, y1, 0]).div(scalar);
      var v4 = new Vector3([x2, y2, 0]).div(scalar);
      drawVector(v3, "green");
      drawVector(v4, "green");
      } else {
        console.log("Division by zero is not allowed");
      }
    } else if (operation === "magnitude") {
      console.log("Magnitude of v1: ", v1.magnitude());
      console.log("Magnitude of v2: ", v2.magnitude());
    } else if (operation === "normalize") {
      var normalizedV1 = new Vector3([x1, y1, 0]).normalize();
      var normalizedV2 = new Vector3([x2, y2, 0]).normalize();
      drawVector(normalizedV1, "green");
      drawVector(normalizedV2, "green");
    } else if (operation === "angle") {
      const angle = angleBetween(v1, v2);
      if (angle !== null) {
        console.log(`Angle between v1 and v2: ${angle.toFixed(2)} degrees`);
      } else {
        console.log("Error: One or both vectors have zero magnitude.");
      }
    } else if (operation == "area") {
      const area = areaTriangle(v1, v2);
      console.log(`Area of the triangle formed by v1 and v2: ${area.toFixed(2)}`);
    }
  }

  function angleBetween(v1, v2) {
    const dotProduct = Vector3.dot(v1, v2);

    // calculate magnitudes of vectors
    const magV1 = v1.magnitude();
    const magV2 = v2. magnitude();

    if (magV1 === 0 || magV2 === 0) {
      console.log("One or both of vectors have zero magnitude.");
      return null;
    }
    const cosTheta = dotProduct / (magV1 * magV2);

    const clampedCosTheta = Math.min(Math.max(cosTheta, -1), 1);

    const angleRadians = Math.acos(clampedCosTheta);
    const angleDegrees = (angleRadians * 180) / Math.PI;
    return angleDegrees;
  }

  function areaTriangle(v1, v2) {
    // cross product
    const crossProduct = Vector3.cross(v1, v2);
    //magnitude of cross crossProduct
    const magnitude = crossProduct.magnitude();
    // area of triangle is half magnitude of cross product
    return magnitude / 2;
  }
  var drawButton = document.getElementById("drawButton");
  drawButton.onclick = handleDrawEvent;

  var drawButton2 = document.getElementById("drawButton2");
  if (drawButton2) {
    drawButton2.onclick = handleDrawOperationEvent;
  }
  handleDrawEvent();
}
