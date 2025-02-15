class Cube{
  constructor(){
    this.type='cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
  }

  render() {
    var rgba = this.color;

    // pass the color of a point to u_fragColor vars
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)

    this.drawCube(this.matrix);
  }

  drawCube(matrix) {
    var rgba = this.color;
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);

    //front of cube

    drawTriangle3D( [0.0,0.0,0.0,   1.0,1.0,0.0,    1.0,0.0,0.0]);
    drawTriangle3D( [0.0,0.0,0.0,   0.0,1.0,0.0,    1.0,1.0,0.0]);

    //back of Cube
    gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
    drawTriangle3D( [0.0,0.0,1.0,   1.0,1.0,1.0,    1.0,0.0,1.0]);
    drawTriangle3D( [0.0,0.0,1.0,   0.0,1.0,1.0,    1.0,1.0,1.0]);

    //top
    drawTriangle3D( [0.0,1.0,0.0,   1.0,1.0,0.0,    1.0,1.0,1.0]);
    drawTriangle3D( [0.0,1.0,0.0,   0.0,1.0,1.0,    1.0,1.0,1.0]);

    //bottom
    drawTriangle3D( [0.0,0.0,0.0,   1.0,0.0,0.0,    1.0,0.0,1.0]);
    drawTriangle3D( [0.0,0.0,0.0,   0.0,0.0,1.0,    1.0,0.0,1.0]);

    //right
    drawTriangle3D( [1.0,0.0,0.0,   1.0,1.0,0.0,    1.0,1.0,1.0]);
    drawTriangle3D( [1.0,0.0,0.0,   1.0,0.0,1.0,    1.0,1.0,1.0]);

    //left
    drawTriangle3D( [0.0,0.0,0.0,   0.0,1.0,0.0,    0.0,1.0,1.0]);
    drawTriangle3D( [0.0,0.0,0.0,   0.0,0.0,1.0,    0.0,1.0,1.0]);
  }
}
