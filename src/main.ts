import './style.css';

import animationLoop from './animationLoop';
import { dispatch, getState } from './store';

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

// TODO: make this dynamic (update values on window resize)
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

dispatch({
  type: 'initialize',
  grid: {
    width: WIDTH,
    height: HEIGHT,
    cellSize: 10,
  },
});

const canvas = createHiDPICanvas(WIDTH, HEIGHT);

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

function getRelativeMousePosition (event: MouseEvent, element: HTMLElement): { x: number, y: number } {
  const ratio = window.devicePixelRatio;
  const rect = element.getBoundingClientRect();
  
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  
  // TODO: finetune out-of-bounds position
  x = Math.max(0, Math.min(x, canvas.width / ratio));
  y = Math.max(0, Math.min(y, canvas.height / ratio));

  return { x, y };
}

// TODO: handle touch events
// TODO: make sure right click doesn't work
canvas.addEventListener('mousedown', event => {
  const where = getRelativeMousePosition(event, canvas);
  dispatch({ type: 'blowStarted', where });
});

window.addEventListener('mouseup', event => {
  const where = getRelativeMousePosition(event, canvas);
  dispatch({ type: 'blowEnded', where });
});

window.addEventListener('mousemove', event => {
  if (!getState().windBlow) {
    return;
  }
  const where = getRelativeMousePosition(event, canvas);

  dispatch({ type: 'blowEndpointMoved', where });
});
