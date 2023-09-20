import { Vector2 } from '.';

export class LineSegment {
  private endpoints: {
    from: Vector2;
    to: Vector2;
  };

  constructor (from: Vector2, to: Vector2) {
    this.endpoints = {
      from: from.copy(),
      to: to.copy(),
    };
  }

  public get from(): Vector2 {
    return this.endpoints.from;
  }

  public get to(): Vector2 {
    return this.endpoints.to;
  }

  public get asVector(): Vector2 {
    return Vector2.subtract(this.from, this.to);
  }

  public closestPointOnSegment(point: Vector2): Vector2 {
    const { x: px, y: py } = point;
    const { x: x1, y: y1 } = this.from;
    const { x: x2, y: y2 } = this.to;

    const t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / ((x2 - x1) ** 2 + (y2 - y1) ** 2);

    if (t < 0) {
      return Vector2.create(x1, y1);
    }
    if (t > 1) {
      return Vector2.create(x2, y2);
    }
    const closestX = x1 + t * (x2 - x1);
    const closestY = y1 + t * (y2 - y1);
    return Vector2.create(closestX, closestY);
  }

  public distanceFrom(point: Vector2): number {
    const segmentPoint = this.closestPointOnSegment(point);
    return Vector2.subtract(point, segmentPoint).length;
  }

  static create(from: Vector2, to: Vector2) {
    return new LineSegment(from, to);
  }
}
