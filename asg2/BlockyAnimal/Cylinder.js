class Cylinder {
  constructor() {
    this.type = 'cylinder';
    this.color = [1.0, 1.0, 0.0, 1.0]; // Yellow color for the head
    this.matrix = new Matrix4();
    this.segments = 32; // Number of segments to approximate the cylinder
  }

  render() {
    var rgba = this.color;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    this.drawCylinder(this.matrix);
  }

  drawCylinder(matrix) {
    var rgba = this.color;
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);

    let angleStep = 360 / this.segments;
    for (let i = 0; i < this.segments; i++) {
      let angle1 = i * angleStep;
      let angle2 = (i + 1) * angleStep;

      let x1 = Math.cos((angle1 * Math.PI) / 180);
      let y1 = Math.sin((angle1 * Math.PI) / 180);
      let x2 = Math.cos((angle2 * Math.PI) / 180);
      let y2 = Math.sin((angle2 * Math.PI) / 180);

      // Draw the top face
      drawTriangle3D([0, 1, 0, x1, 1, y1, x2, 1, y2]);

      // Draw the bottom face
      drawTriangle3D([0, 0, 0, x1, 0, y1, x2, 0, y2]);

      // Draw the side faces
      drawTriangle3D([x1, 0, y1, x1, 1, y1, x2, 0, y2]);
      drawTriangle3D([x1, 1, y1, x2, 1, y2, x2, 0, y2]);
    }
  }
}
