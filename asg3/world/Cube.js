class Cube {
  constructor() {
    this.type = 'cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textureNum=-1;
  }

  render() {
    var rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    //  front face
    drawTriangle3DUV(
      [0.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 0.0, 0.0],
      [0, 0,  1, 1,  1, 0]
    );
    drawTriangle3DUV(
      [0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   1.0, 1.0, 0.0],
      [0, 0,  0, 1,  1, 1]
    );

    // back face
    drawTriangle3DUV(
      [0.0, 0.0, 1.0,   1.0, 1.0, 1.0,   1.0, 0.0, 1.0],
      [1, 0,  0, 1,  0, 0]  // Flip UV X-axis
    );
    drawTriangle3DUV(
      [0.0, 0.0, 1.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0],
      [1, 0,  1, 1,  0, 1]  // Flip UV X-axis
    );

    //top face
    drawTriangle3DUV(
      [0.0, 1.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0],
      [0, 0,  1, 0,  1, 1]  // Flip Y-axis
    );
    drawTriangle3DUV(
      [0.0, 1.0, 0.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0],
      [0, 0,  0, 1,  1, 1]  // Flip Y-axis
    );

    //bottom face
    drawTriangle3DUV(
      [0.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 1.0],
      [1, 0,  0, 0,  0, 1]  // Flip UV X-axis
    );
    drawTriangle3DUV(
      [0.0, 0.0, 0.0,   0.0, 0.0, 1.0,   1.0, 0.0, 1.0],
      [1, 0,  1, 1,  0, 1]  // Flip UV X-axis
    );

    //right face
    drawTriangle3DUV(
      [1.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0],
      [0, 0,  0, 1,  1, 1]  // Swapped X-coordinates to fix mirroring
    );
    drawTriangle3DUV(
      [1.0, 0.0, 0.0,   1.0, 0.0, 1.0,   1.0, 1.0, 1.0],
      [0, 0,  1, 0,  1, 1]  // Swapped X-coordinates to fix mirroring
    );

    //left face
    drawTriangle3DUV(
      [0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 1.0],
      [1, 0,  1, 1,  0, 1]  // Flip UV X-axis
    );
    drawTriangle3DUV(
      [0.0, 0.0, 0.0,   0.0, 0.0, 1.0,   0.0, 1.0, 1.0],
      [1, 0,  0, 0,  0, 1]  // Flip UV X-axis
    );
  }
}
