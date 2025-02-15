class Vector {
  constructor(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  // Subtract another vector from this vector
  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  // Divide this vector by a scalar value
  divide(scalar) {
    if (scalar === 0) {
      console.error("Division by zero is not allowed.");
      return this;
    }
    return new Vector(this.x / scalar, this.y / scalar, this.z / scalar);
  }

  // Compute the cross product of this vector and another vector
  cross(v) {
    return new Vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  // Compute the length (magnitude) of this vector
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  // Add another vector to this vector
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  // Optional: A helper method to log the vector's values
  log() {
    console.log(`Vector(${this.x}, ${this.y}, ${this.z})`);
  }
}
