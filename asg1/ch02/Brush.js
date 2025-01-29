class Brush {
  constructor() {
    this.type = 'brush';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
    this.density = 10;
  }

  render() {
    const xy = this.position;
    const rgba = this.color;

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    for (let i = 0; i < this.density; i++) {
      const offsetX = (Math.random() - 0.5) * this.size / 100.0; //spread factor
      const offsetY = (Math.random() - 0.5) * this.size / 100.0;

      const pointX = xy[0] + offsetX;
      const pointY = xy[1] + offsetY;
    // Draw each point in the brush stroke
      gl.uniform1f(u_Size, this.size / 3);
      gl.vertexAttrib3f(a_Position, pointX, pointY, 0.0);
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }
}
