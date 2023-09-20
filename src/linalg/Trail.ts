import { LineSegment, Vector2 } from '.';

type TrailSection = {
  segment: LineSegment;
  controlPoints: [Vector2, Vector2];
}

export class Trail {
  private tail: Vector2;
  private head: Vector2;
  private speed: Vector2;
  private acceleration: Vector2;
  private displacements: Vector2[];

  constructor(x: number, y: number) {
    this.tail = this.head = Vector2.create(x, y);
    this.speed = Vector2.zero();
    this.acceleration = Vector2.zero();
    this.displacements = [Vector2.zero()];
  }

  public get x(): number {
    return this.head.x;
  }

  public get y(): number {
    return this.head.y;
  }

  public get sections(): TrailSection[] {
    for (let i = 0; i < this.displacements.length; i++) {
      const curr = this.displacements[i];
      const next = this.displacements[i + 1];

      if (curr && next) {

      }
    }

    return [];
  }



  public setAcceleration(acceleration: Vector2): this {
    this.acceleration = acceleration.copy().multiply(Math.random());
    return this;
  }

  public update(): this {
    this.speed.add(this.acceleration).capLength(3);
    this.head.add(this.speed)

    this.commitDisplacement();

    this.acceleration.setLength(Math.max(0, this.acceleration.length - 0.05));
    this.acceleration.setHeading(this.acceleration.heading)
    this.speed.setLength(Math.max(0, this.speed.length - (0.02 * Math.random())));

    return this;
  }

  private commitDisplacement() {
    const threshold = 5;
    const { head } = this;

    
  }
}
