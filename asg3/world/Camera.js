class Camera {
  constructor() {
    this.eye = new Vector(0, 0, 3);
    this.at = new Vector(0, 0, -100);
    this.up = new Vector(0, 1, 0);
  }

  forward() {
    var f = this.at.subtract(this.eye);
    f = f.divide(f.length());
    this.at = this.at.add(f);
    this.eye = this.eye.add(f);
  }

  back() {
    var f = this.eye.subtract(this.at);
    f = f.divide(f.length());
    this.at = this.at.add(f);
    this.eye = this.eye.add(f);
  }

  left() {
    var f = this.eye.subtract(this.at);
    f = f.divide(f.length());
    var s = f.cross(this.up);
    s = s.divide(s.length());
    this.at = this.at.add(s);
    this.eye = this.eye.add(s);
  }

  right() {
    var f = this.eye.subtract(this.at);
    f = f.divide(f.length());
    var s = this.up.cross(f);
    s = s.divide(s.length());
    this.at = this.at.add(s);
    this.eye = this.eye.add(s);
  }

  rotateLeft(angle = -5) {
    this.rotateAroundUp(angle);
  }

  rotateRight(angle = 5) {
    this.rotateAroundUp(angle);
  }

  rotateAroundUp(angle) {
    let radians = (angle * Math.PI) / 180;
    let f = this.at.subtract(this.eye);

    let cosTheta = Math.cos(radians);
    let sinTheta = Math.sin(radians);

    let newX = f.x * cosTheta - f.z * sinTheta;
    let newZ = f.x * sinTheta + f.z * cosTheta;

    this.at = new Vector(this.eye.x + newX, this.at.y, this.eye.z + newZ);
  }
}
