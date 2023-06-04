import { State } from './state';

export default function draw(state: State, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, state.grid.width, state.grid.height);

  if (!state.initialized) {
    return;
  }

  ctx.fillStyle = '#fff';
  ctx.fillText(state.debug['deltaTime'], 10, 10)

  if (state.windBlow) {
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(state.windBlow.start.x, state.windBlow.start.y);
    ctx.lineTo(state.windBlow.end.x, state.windBlow.end.y);
    ctx.stroke();
  }
}
