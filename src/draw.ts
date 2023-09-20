import { State } from './state';

let showDebugOverlay = false;

window.addEventListener('keydown', event => {
  if (event.key === 'Control') {
    showDebugOverlay = !showDebugOverlay;
  }
})

export default function draw(state: State, ctx: CanvasRenderingContext2D) {
  if (!ctx) {
    throw new Error('offscreen canvas context not found')
  }

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, state.grid.width, state.grid.height);

  if (!state.initialized) {
    return;
  }

  if (showDebugOverlay) {
    state.vectorField.forEachCell(({ vector, row, column, index, cellSize }) => {
      const cell = {
        x: column * cellSize,
        y: row * cellSize,
      };
      const center = {
        x: cell.x + cellSize / 2,
        y: cell.y + cellSize / 2,
      };
  
      const start = {
        x: center.x - vector.x / 2,
        y: center.y - vector.y / 2,
      };
      const end = {
        x: center.x + vector.x / 2,
        y: center.y + vector.y / 2,
      };
  
      ctx.strokeStyle = vector.length > 1 ? '#000' : 'lightgray';
      ctx.fillStyle = 'white';
      ctx.beginPath();
  
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(end.x, end.y, 2, 2, Math.PI / 4, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
  
    });
  
    state.windTunnels.forEach(({ from, wind }) => {
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(from.x + wind.x, from.y + wind.y);
      ctx.stroke();
    });
  }


  state.entities.forEach(entity => {
    ctx.beginPath;
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'white';
    ctx.beginPath;
    ctx.beginPath();
    ctx.arc(entity.x, entity.y, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  });
}
