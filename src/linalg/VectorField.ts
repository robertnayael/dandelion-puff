import { LineSegment, Vector2 } from '.';
import { WindTunnel } from '../state/types';

type VectorFieldOptions = {
  width: number;
  height: number;
  cellSize: number;
};

type CellInfo = {
  vector: Vector2;
  center: Vector2;
  index: number;
  row: number;
  column: number;
  cellSize: number,
}
type ForEachCallback = (cellInfo: CellInfo) => void;
type MapCallback<T> = (cellInfo: CellInfo) => T;

export class VectorField {
  private width: number;
  private height: number;
  private cellSize: number;
  private columns: number;
  private rows: number;
  private vectors: Vector2[];

  constructor({ width, height, cellSize }: VectorFieldOptions) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.rows = Math.ceil(height / cellSize);
    this.columns = Math.ceil(width / cellSize);
    const cellCount = this.rows * this.columns;
    this.vectors = Number.isNaN(cellCount)
      ? []
      : new Array(cellCount).fill(null).map(Vector2.zero);
  }

  public copy(): VectorField {
    const { width, height, cellSize } = this;
    const field = VectorField.create({ width, height, cellSize });
    field.vectors = this.vectors.map(v => v.copy());
    return field;
  }

  public forEach(callback: ForEachCallback): void {
    this.vectors.forEach((vector, index) => {
      const { cellSize } = this;
      const [row, column] = this.coordinatesFromIndex(index);
      const center = Vector2.create(
        column * cellSize + cellSize / 2,
        row * cellSize + cellSize / 2,
      );
      callback({
        vector,
        center,
        index,
        column,
        row,
        cellSize: this.cellSize,
      });
    });
  }

  public map<T>(callback: MapCallback<T>): T[] {
    return this.vectors.map((vector, index) => {
      const { cellSize } = this;
      const [row, column] = this.coordinatesFromIndex(index);
      const center = Vector2.create(
        column * cellSize + cellSize / 2,
        row * cellSize + cellSize / 2,
      );
      return callback({
        vector,
        index,
        center,
        column,
        row,
        cellSize,
      });
    });
  }

  public getVectorAtPixelPosition({ x, y }: Pick<Vector2, 'x' | 'y'>): { vector: Vector2, index: number} | null {
    const row = Math.floor(y / this.cellSize);
    const column = Math.floor(x / this.cellSize);
    const index = this.columns * row + column;
    const vector = this.vectors[index];
    if (vector) {
      return {
        vector,
        index,
      };
    }
    return null;
  }

  /**
   * @modifies `this.vectors`
   * @param amount How much 
   */
  public decrease(amount: number): this {
    this.vectors.forEach(v => v.length > 0 && v.setLength(Math.max(0, v.length - amount)));
    return this;
  }

  public applyWindTunnels(tunnels: WindTunnel[], increaseRate: number): this {
    const distanceThreshold = 45;
    const maxWindSpeed = 12;
    const increaseSpeed = maxWindSpeed * increaseRate;
    const decreaseSpeed = increaseSpeed / 4;

    const affectedCells: number[] = [];

    tunnels.forEach(({ from, wind }) => {
      if (wind.length < 5) {
        return;
      }
      const maxSpeed = increaseSpeed * Math.random();
      const windComponent = wind
        .copy()
        .capLength(increaseSpeed * Math.random())

      const tunnel = LineSegment.create(from, Vector2.add(from, wind));
      const cells = this.getCellsNearSegment(tunnel, distanceThreshold);
      cells.forEach(c => {
        c.vector.add(windComponent).capLength(12);
        affectedCells.push(c.index);
      })      
    });

    this
      .map(identity => identity)
      .filter(c => !affectedCells.includes(c.index) && c.vector.length > 0)
      .forEach(c => c.vector.setLength(Math.max(0, c.vector.length - decreaseSpeed* Math.random())));

    return this;
  }

  private getCellsNearSegment(
    segment: LineSegment,
    distanceThreshold: number): Array<CellInfo & {
    distanceFromSegment: number;
    distanceFromStart: number;
  }> {
    const { from, to } = segment;
    const { cellSize } = this;

    const pixelBounds = {
      top: Math.min(from.y, to.y) - distanceThreshold,
      bottom: Math.max(from.y, to.y) + distanceThreshold,
      left: Math.min(from.x, to.x) - distanceThreshold,
      right: Math.max(from.x, to.x) + distanceThreshold,
    };

    const bounds = {
      top: Math.floor(pixelBounds.top / cellSize),
      bottom: Math.floor(pixelBounds.bottom / cellSize),
      left: Math.floor(pixelBounds.left / cellSize),
      right: Math.floor(pixelBounds.right / cellSize),
    };

    return this
      // Just get complete cell info, with rows and columns
      // TODO: expose public getter `cells` and just return the enriched array
      .map(indentity => indentity)
      // Narrow down just the cells that are within or near the segment's bounding box:
      .filter(({ column, row }) => column >= bounds.left && column <= bounds.right && row >= bounds.top && row <= bounds.bottom)
      .map(cell => ({
        ...cell,
        distanceFromSegment: segment.distanceFrom(cell.center),
        distanceFromStart: 0,
      }))
      .filter(cell => cell.distanceFromSegment <= distanceThreshold);
  }

  /**
   * @modifies `this.vectors`
   * @param index Cell index
   */
  private setCellVector(index: number) {

  }

  private coordinatesFromIndex(index: number): [row: number, column: number] {
    const rowIndex = Math.floor(index / this.columns);
    const colIndex = index % this.columns;
    return [rowIndex, colIndex];
  }

  private validateOrThrow(): void {
    if (Number.isNaN(this.width)) {
      throw new Error('VectorField width not specified');
    }
    if (Number.isNaN(this.height)) {
      throw new Error('VectorField height not specified');
    }
    if (Number.isNaN(this.cellSize)) {
      throw new Error('VectorField cellSize not specified');
    }
  }

  static create(options: VectorFieldOptions): VectorField {
    return new VectorField(options);
  }

  static empty(): VectorField {
    return new VectorField({
      width: NaN,
      height: NaN,
      cellSize: NaN,
    });
  }

  static increaseNearbyVectors(field: VectorField, segmentStart: Vector2, segmentEnd: Vector2): VectorField {
    const distanceThreshold = 25;
    const maxLength = 12;
    const step = 0.1;
    const pixelBox = {
      top: Math.min(segmentStart.y, segmentEnd.y) - distanceThreshold,
      bottom: Math.max(segmentStart.y, segmentEnd.y) + distanceThreshold,
      left: Math.min(segmentStart.x, segmentEnd.x) - distanceThreshold,
      right: Math.max(segmentStart.x, segmentEnd.x) + distanceThreshold,
    };

    const box = {
      top: Math.floor(pixelBox.top / field.cellSize),
      bottom: Math.ceil(pixelBox.bottom / field.cellSize),
      left: Math.floor(pixelBox.left / field.cellSize),
      right: Math.ceil(pixelBox.right / field.cellSize),
    };

    const direction = Vector2.subtract(segmentEnd, segmentStart).heading;

    field.forEach(({ vector, row, column }) => {
      if (
        column >= box.left && column <= box.right && row >= box.top && row <= box.bottom
      ) {
        vector.setHeading(direction)
        if (vector.length < maxLength) {
          vector.setLength(vector.length + step);
        }
      }
    });

    return field;
  }
}
