function drawPicture() {
  // array to hold the vertices of all TRIANGLES
  //face
  const triangle1 = [
    -0.4, 0.4, //vertex 1
    0.0, 0.6,
    0.4, 0.4
  ];
  // left ear
  const triangle2 = [
    -0.6, 0.4,
    -0.4, 0.4,
    -0.4, 0.6
  ];
  // right ear
  const triangle3 = [
    0.6, 0.4,
    0.4, 0.4,
    0.4, 0.6
  ];
  const triangle4 = [
    -0.4, 0.4,
    -0.4, 0.0,
    -0.6, 0.0
  ];
  const triangle5 = [
    0.4, 0.4,
    0.4, 0.0,
    0.6, 0.0
  ];
  const triangle6 = [
    -0.4, 0.4,
    -0.4, 0.0,
    0.0, 0.0
  ];
  const triangle7 = [
    -0.4, 0.4,
    0.0, 0.4,
    0.0, 0.0
  ];
  const triangle8 = [
    0.0, 0.4,
    0.4, 0.0,
    0.0, 0.0
  ];
  const triangle9 = [
    0.0, 0.4,
    0.4, 0.4,
    0.4, 0.0
  ];
  const triangle10 = [
    -0.6, 0.0,
    -0.6, -0.6,
    0.0, -0.6
  ];
  const triangle11 = [
    -0.6, 0.0,
    0.0, 0.0,
    0.0, -0.6
  ];
  const triangle12 = [
    0.0, 0.0,
    0.0, -0.6,
    0.6, -0.6
  ];
  const triangle13 = [
    0.0, 0.0,
    0.6, -0.6,
    0.6, 0.0
  ];
  const triangle14 = [
    -0.6, -0.6,
    -0.4, -0.6,
    -0.4, -0.8
  ];
  const triangle15 = [
    0.4, -0.6,
    0.4, -0.8,
    0.6, -0.6
  ];
  const triangle16 = [
    -0.4, -0.6,
    -0.4, -0.8,
    0.0, -0.8
  ];
  const triangle17 = [
    -0.4, -0.6,
    0.0, -0.6,
    0.0, -0.8
  ];
  const triangle18 = [
    0.4, -0.8,
    0.0, -0.6,
    0.0, -0.8
  ];
  const triangle19 = [
    0.4, -0.8,
    0.0, -0.6,
    0.4, -0.6
  ];
  // inner mouth area
  const triangle20 = [
    -0.2, -0.1,
    -0.2, -0.5,
    -0.3, -0.5
  ];
  const triangle21 = [
    0.2, -0.1,
    0.2, -0.5,
    0.3, -0.5
  ];
  const triangle22 = [
    0.2, -0.1,
    0.2, -0.5,
    -0.2, -0.5
  ];
  const triangle23 = [
    0.2, -0.1,
    -0.2, -0.1,
    -0.2, -0.5
  ];
  const triangle24 = [
    -0.3, -0.5,
    -0.2, -0.7,
    -0.2, -0.5
  ];
  const triangle25 = [
    0.3, -0.5,
    0.2, -0.7,
    0.2, -0.5
  ];
  const triangle26 = [
    -0.2, -0.5,
    0.2, -0.7,
    0.2, -0.5
  ];
  const triangle27 = [
    -0.2, -0.5,
    0.2, -0.7,
    -0.2, -0.7
  ];
  const triangle28 = [
    -0.45, 0.45,
    -0.45, 0.5,
    -0.5, 0.45
  ];
  const triangle29 = [
    0.45, 0.45,
    0.45, 0.5,
    0.5, 0.45
  ];
  //eyes
  const triangle30 = [
    -0.4, 0.0,
    -0.3, 0.1,
    -0.3, 0.05
  ];
  const triangle31 = [
    -0.2, 0.0,
    -0.3, 0.1,
    -0.3, 0.05
  ];
  const triangle32 = [
    0.4, 0.0,
    0.3, 0.1,
    0.3, 0.05
  ];
  const triangle33 = [
    0.2, 0.0,
    0.3, 0.1,
    0.3, 0.05
  ];
  // nose
  const triangle34 = [
    0.067, -0.2,
    0.13, -0.2,
    0.1, -0.15
  ];
  const triangle35 = [
    -0.067, -0.2,
    -0.13, -0.2,
    -0.1, -0.15
  ];
  //mouth
  const triangle36 = [
    0.0, -0.4,
    0.03, -0.6,
    -0.03, -0.6
  ];
  const triangle37 = [
    -0.15, -0.65,
    0.0, -0.6,
    -0.03, -0.6
  ];
  const triangle38 = [
    0.15, -0.65,
    0.0, -0.6,
    0.03, -0.6
  ];


  gl.uniform4f(u_FragColor, 0.8, 0.6, 0.4, 1.0); //brown color
  drawTriangle(triangle1);
  drawTriangle(triangle2);
  drawTriangle(triangle3);
  drawTriangle(triangle4);
  drawTriangle(triangle5);
  drawTriangle(triangle6);
  drawTriangle(triangle7);
  drawTriangle(triangle8);
  drawTriangle(triangle9);
  drawTriangle(triangle10);
  drawTriangle(triangle11);
  drawTriangle(triangle12);
  drawTriangle(triangle13);
  drawTriangle(triangle14);
  drawTriangle(triangle15);
  drawTriangle(triangle16);
  drawTriangle(triangle17);
  drawTriangle(triangle18);
  drawTriangle(triangle19);
  gl.uniform4f(u_FragColor, 0.5, 0.3, 0.2, 1.0);
  drawTriangle(triangle20);
  drawTriangle(triangle21);
  drawTriangle(triangle22);
  drawTriangle(triangle23);
  drawTriangle(triangle24);
  drawTriangle(triangle25);
  drawTriangle(triangle26);
  drawTriangle(triangle27);
  drawTriangle(triangle28);
  drawTriangle(triangle29);
  drawTriangle(triangle30);
  drawTriangle(triangle31);
  drawTriangle(triangle32);
  drawTriangle(triangle33);
  gl.uniform4f(u_FragColor, 0.2, 0.1, 0.05, 1.0);
  drawTriangle(triangle34);
  drawTriangle(triangle35);
  drawTriangle(triangle36);
  drawTriangle(triangle37);
  drawTriangle(triangle38);
}
