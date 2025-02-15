const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    console.error('WebGL not supported, falling back on experimental-webgl');
    gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
    alert('Your browser does not support WebGL');
}

gl.enable(gl.DEPTH_TEST);

<script id="vertex-shader" type="x-shader/x-vertex">
    attribute vec4 a_position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotation;
    void main() {
        gl_Position = u_GlobalRotation * u_ModelMatrix * a_position;
    }
</script>

<script id="fragment-shader" type="x-shader/x-fragment">
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
</script>

function drawCube(gl, program, matrix, color) {
    const vertices = new Float32Array([
        // Front face
        -0.5, -0.5,  0.5,
         0.5, -0.5,  0.5,
         0.5,  0.5,  0.5,
        -0.5,  0.5,  0.5,

        // Back face
        -0.5, -0.5, -0.5,
         0.5, -0.5, -0.5,
         0.5,  0.5, -0.5,
        -0.5,  0.5, -0.5
    ]);

    const indices = new Uint16Array([
        0, 1, 2, 0, 2, 3, // Front face
        4, 5, 6, 4, 6, 7, // Back face
        0, 1, 5, 0, 5, 4, // Bottom face
        2, 3, 7, 2, 7, 6, // Top face
        0, 3, 7, 0, 7, 4, // Left face
        1, 2, 6, 1, 6, 5  // Right face
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    const matrixUniformLocation = gl.getUniformLocation(program, 'u_ModelMatrix');
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);

    const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4fv(colorUniformLocation, color);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

function renderScene(gl, program, globalRotation, bodyRotation, legRotation, armRotation) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const bodyMatrix = mat4.create();
    mat4.scale(bodyMatrix, bodyMatrix, [2, 1, 2]);
    drawCube(gl, program, bodyMatrix, [0.8, 0.6, 0.4, 1]);

    const headMatrix = mat4.create();
    mat4.translate(headMatrix, headMatrix, [0, 1.5, 0]);
    mat4.scale(headMatrix, headMatrix, [0.5, 0.5, 0.5]);
    drawCube(gl, program, headMatrix, [0.8, 0.6, 0.4, 1]);

    const leftArmMatrix = mat4.create();
    mat4.translate(leftArmMatrix, leftArmMatrix, [-1.5, 0, 0]);
    mat4.rotate(leftArmMatrix, leftArmMatrix, armRotation, [0, 0, 1]);
    mat4.scale(leftArmMatrix, leftArmMatrix, [0.5, 1, 0.5]);
    drawCube(gl, program, leftArmMatrix, [0.8, 0.6, 0.4, 1]);

    const rightArmMatrix = mat4.create();
    mat4.translate(rightArmMatrix, rightArmMatrix, [1.5, 0, 0]);
    mat4.rotate(rightArmMatrix, rightArmMatrix, -armRotation, [0, 0, 1]);
    mat4.scale(rightArmMatrix, rightArmMatrix, [0.5, 1, 0.5]);
    drawCube(gl, program, rightArmMatrix, [0.8, 0.6, 0.4, 1]);

    const leftLegMatrix = mat4.create();
    mat4.translate(leftLegMatrix, leftLegMatrix, [-0.5, -1.5, 0]);
    mat4.rotate(leftLegMatrix, leftLegMatrix, legRotation, [1, 0, 0]);
    mat4.scale(leftLegMatrix, leftLegMatrix, [0.5, 1, 0.5]);
    drawCube(gl, program, leftLegMatrix, [0.8, 0.6, 0.4, 1]);

    const rightLegMatrix = mat4.create();
    mat4.translate(rightLegMatrix, rightLegMatrix, [0.5, -1.5, 0]);
    mat4.rotate(rightLegMatrix, rightLegMatrix, -legRotation, [1, 0, 0]);
    mat4.scale(rightLegMatrix, rightLegMatrix, [0.5, 1, 0.5]);
    drawCube(gl, program, rightLegMatrix, [0.8, 0.6, 0.4, 1]);
}

let animationFrameId;
let isAnimating = false;

function tick() {
    if (isAnimating) {
        g_time += 0.01;
        updateAnimationAngles();
        renderScene(gl, program, globalRotation, bodyRotation, legRotation, armRotation);
        animationFrameId = requestAnimationFrame(tick);
    }
}

function startAnimation() {
    if (!isAnimating) {
        isAnimating = true;
        tick();
    }
}

function stopAnimation() {
    if (isAnimating) {
        isAnimating = false;
        cancelAnimationFrame(animationFrameId);
    }
}

canvas.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) {
        const rotationX = (event.clientX / canvas.width) * 360;
        const rotationY = (event.clientY / canvas.height) * 360;
        mat4.rotate(globalRotation, globalRotation, rotationX, [0, 1, 0]);
        mat4.rotate(globalRotation, globalRotation, rotationY, [1, 0, 0]);
        renderScene(gl, program, globalRotation, bodyRotation, legRotation, armRotation);
    }
});

let lastTime = 0;
function tick() {
    const now = performance.now();
    const deltaTime = now - lastTime;
    lastTime = now;

    if (isAnimating) {
        g_time += deltaTime * 0.001;
        updateAnimationAngles();
        renderScene(gl, program, globalRotation, bodyRotation, legRotation, armRotation);
        animationFrameId = requestAnimationFrame(tick);
    }

    document.getElementById('fps').innerText = `FPS: ${Math.round(1000 / deltaTime)}`;
}
