import { dispatch, getState } from './store';
import draw from './draw';

export default function animationLoop(ctx: CanvasRenderingContext2D) {
  let prevTimestamp = 0;

  function animate(timestamp: number) {
    const deltaTime = timestamp - prevTimestamp;
    prevTimestamp = timestamp;

    draw(getState(), ctx);

    dispatch({ type: 'nextFrame', deltaTime });

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}
