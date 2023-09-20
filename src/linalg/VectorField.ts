import { LineSegment, Vector2 } from '.';
import { v4 as uuid } from 'uuid';
import { WindTunnel } from '../state/types';

type VectorFieldOptions = {
  /** With in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Size the cell rectangle side in pixels */
  cellSize: number;
};

type Cell = {
  /** Vector representing the cell */
  vector: Vector2;
  /** Cell's index in the whole field */
  index: number;
  /** Unique cell ID */
  id: string;
  /** Cell's center relative to (0,0) of the vector field */
  center: Vector2;
  /** Row index */
  row: number;
  /** Column index */
  column: number;
  /** Size of the cell rectangle side */
  cellSize: number,
}

export class VectorField {
  private width: number;
  private height: number;
  private cellSize: number;

  private cells: Cell[];

  constructor(options: VectorFieldOptions) {
    const { width, height, cellSize } = options;
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    
    this.cells = VectorField.initializeCells(options);
  }

  /**
   * Creates a collection of vector field cells, including the information
   * about each cell's position, index, and unique ID.
   */
  private static initializeCells({ width, height, cellSize }: VectorFieldOptions): Cell[] {
    if (!width || !height || !cellSize) return [];

    const rows = Math.ceil(height / cellSize);
    const columns = Math.ceil(width / cellSize);
    const cellCount = rows * columns;

    return new Array(cellCount).fill(null).map((_, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const center = Vector2.create(
        column * cellSize + cellSize / 2,
        row * cellSize + cellSize / 2,
      );
      return {
        vector: Vector2.zero(),
        index,
        id: uuid(),
        center,
        row,
        column,
        cellSize,
      }
    })
  }

  public copy(): VectorField {
    const { width, height, cellSize } = this;
    const field = VectorField.create({ width, height, cellSize });
    field.cells = this.cells.map(cell => ({
      ...cell,
      vector: cell.vector.copy(),
    }))
    return field;
  }

  public forEachCell(callback: (cell: Cell) => void): void {
    this.cells.forEach(callback);
  }

  public getVectorAtPixelPosition({ x, y }: Pick<Vector2, 'x' | 'y'>): Vector2 | null {
    const row = Math.floor(y / this.cellSize);
    const column = Math.floor(x / this.cellSize);
    return this.cells.find(c => c.row === row && c.column === column)?.vector || null
  }

  public applyWindTunnels(tunnels: WindTunnel[], increaseRate: number): this {
    const distanceThreshold = 45;
    const maxWindSpeed = 12;
    const increaseSpeed = maxWindSpeed * increaseRate;
    const decreaseSpeed = increaseSpeed / 4;

    const nonAffectedCells = new Set<Cell>(this.cells);

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
        c.cell.vector.add(windComponent).capLength(12);
        nonAffectedCells.delete(c.cell)
      })      
    });

    nonAffectedCells.forEach(c => {
      c.vector.setLength(Math.max(0, c.vector.length - decreaseSpeed* Math.random()))
    })

    return this;
  }

  private getCellsNearSegment(
    segment: LineSegment,
    distanceThreshold: number): Array<{
      cell: Cell,
      distanceFromSegment: number;
      distanceFromSegmentStart: number;
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

    return this.cells
      .filter(({ column, row }) => column >= bounds.left && column <= bounds.right && row >= bounds.top && row <= bounds.bottom)
      .map(cell => ({
        cell,
        distanceFromSegment: segment.distanceFrom(cell.center),
        distanceFromSegmentStart: 0, // TODO
      }))
      .filter(c => c.distanceFromSegment <= distanceThreshold);
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
}
