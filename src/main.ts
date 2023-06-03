import animationLoop from './animationLoop';
import { dispatch } from './store';

function createHiDPICanvas(width: number, height: number) {
  const ratio = window.devicePixelRatio;
  var c = document.createElement('canvas');
  c.width = width * ratio;
  c.height = height * ratio;
  c.style.width = `${width}px`;
  c.style.height = `${height}px`;
  c.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0);
  return c;
}

dispatch({
  type: 'initialize',
  grid: {
    width: 100,
    height: 50,
    cellSize: 10,
  },
});

const canvas = createHiDPICanvas(200, 300);

const ctx = canvas.getContext('2d');
const appContainer = document.querySelector('#app');

if (!appContainer) {
  throw new Error('Could not find the app container');
}
if (!ctx) {
  throw new Error('Canvas rendering context is not ready yet');
}

appContainer.appendChild(canvas);

animationLoop(ctx);
