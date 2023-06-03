import { State } from './state';

export default function draw(state: State, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 200, 300);

  if (!state.initialized) {
    return;
  }

  ctx.fillStyle = '#fff';
  ctx.fillText(state.debug['deltaTime'], 10, 10)
}
