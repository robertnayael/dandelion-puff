import { Vector2 } from '.';

export class SimpleEntity {
  private position: Vector2;
  private speed: Vector2;
  private acceleration: Vector2;

  constructor(x: number, y: number) {
    this.position = Vector2.create(x, y);
    this.speed = Vector2.zero();
    this.acceleration = Vector2.zero();
  }

  public get x(): number {
    return this.position.x;
  }

  public get y(): number {
    return this.position.y;
  }

  public setAcceleration(acceleration: Vector2): this {
    this.acceleration = acceleration.copy().multiply(Math.random());
    return this;
  }

  public update(): this {
    this.speed.add(this.acceleration).capLength(3);
    this.position.add(this.speed)
    this.acceleration.setLength(Math.max(0, this.acceleration.length - 0.05));
    this.acceleration.setHeading(this.acceleration.heading)
    // this.speed.setLength(Math.max(0, this.speed.length - 0.02));
    this.speed.setLength(Math.max(0, this.speed.length - (0.02 * Math.random())));

    return this;
  }  
}
