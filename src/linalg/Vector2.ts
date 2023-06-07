import { Vector } from 'p5';

export class Vector2 {
  private vector: Vector;

  constructor(x: number, y: number) {
    this.vector = new Vector(x, y);
  }

  public copy(): Vector2 {
    return Vector2.create(this.x, this.y);
  }

  public get x(): number {
    return this.vector.x;
  }

  public get y(): number {
    return this.vector.y;
  }

  public get length(): number {
    return this.vector.mag();
  }

  public get heading(): number {
    return this.vector.heading();
  }

  public setLength(length: number): this {
    this.vector.setMag(length);
    return this;
  }

  public capLength(maxLength: number, debug = false): this {
    if (!Number.isNaN(this.length) && this.length > maxLength) {
      if (debug) {
        console.log(this.length, 'cap at:', maxLength)
      }
      this.setLength(maxLength);
    }
    return this;
  }

  public setHeading(headingOrVector: number | Vector2): this {
    typeof headingOrVector === 'number'
      ? this.vector.setHeading(headingOrVector)
      : this.vector.setHeading(headingOrVector.heading);
    return this;
  }

  public multiply(amount: number): this {
    this.vector.mult(amount);
    return this;
  }

  public normalize(): this {
    this.vector.normalize()
    return this;
  }

  public add(vector: Vector2): this {
    this.vector.add(vector.vector);
    return this;
  }

  public subtract(vector: Vector2): this {
    this.vector.sub(vector.vector);
    return this;
  }

  static create(x: number, y: number): Vector2 {
    return new Vector2(x, y);
  }

  static zero() {
    return new Vector2(0, 0);
  }

  static add(vectorA: Vector2, vectorB: Vector2): Vector2 {
    const vector = vectorA.vector.copy().add(vectorB.vector);
    return Vector2.create(vector.x, vector.y);
  }

  static subtract(vectorA: Vector2, vectorB: Vector2): Vector2 {
    const vector = vectorA.vector.copy().sub(vectorB.vector);
    return Vector2.create(vector.x, vector.y);
  }

  static normalize(vector: Vector2): Vector2 {
    const { x, y } = vector.vector.copy().normalize();
    return Vector2.create(x, y);
  }
}
