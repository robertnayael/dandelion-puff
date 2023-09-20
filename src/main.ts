import { v4 as uuidv4 } from 'uuid';
import { Application, Graphics } from 'pixi.js';

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

// const {view: canvas, stage, ...pixiApp} = new Application<HTMLCanvasElement>({
//   width: WIDTH,
//   height: HEIGHT,
//   resolution: window.devicePixelRatio,
//   autoDensity: true
// })

// const rectangle = new Graphics();
// rectangle.lineStyle({width: 4, color: 0xFF3300, alpha: 1});
// rectangle.beginFill(0x66CCFF);
// rectangle.drawRect(0, 0, 64, 64);
// rectangle.endFill();
// rectangle.x = 170;
// rectangle.y = 170;
// stage.addChild(rectangle);

// rectangle.filters = [
  
// ]


// let WIDTH = 400;
// let HEIGHT = 200;

dispatch({
  type: 'initialize',
  grid: {
    width: WIDTH,
    height: HEIGHT,
    cellSize: 20,
  },
});

const canvas = createHiDPICanvas(WIDTH, HEIGHT);
export const offscreenCanvas = createHiDPICanvas(WIDTH, HEIGHT);

const ctx = canvas.getContext('2d');
const appContainer = document.querySelector('#app');

if (!appContainer) {
  throw new Error('Could not find the app container');
}
if (!ctx) {
  throw new Error('Canvas rendering context is not ready yet');
}

appContainer.appendChild(canvas)

animationLoop(ctx);

import { Vector2 } from './linalg';
function getRelativeMousePosition (event: MouseEvent, element: HTMLElement): Vector2 {
  const ratio = window.devicePixelRatio;
  const rect = element.getBoundingClientRect();
  
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  
  // TODO: finetune out-of-bounds position
  x = Math.max(0, Math.min(x, canvas.width / ratio));
  y = Math.max(0, Math.min(y, canvas.height / ratio));

  return Vector2.create(x, y);
}

function setupWindSourceListeners () {
  let id: string | null = null;
  // TODO: handle touch events
  // TODO: make sure right click doesn't work
  canvas.addEventListener('mousedown', event => {
    id = uuidv4();
    const coords = getRelativeMousePosition(event, canvas);
    dispatch({ type: 'addWindSource', coords, id });
  });

  window.addEventListener('mouseup', () => {
    if (id) {
      dispatch({ type: 'removeWindSource', id });
      id = null;
    }
  });

  window.addEventListener('mousemove', event => {
    if (id) {
      const coords = getRelativeMousePosition(event, canvas);
      dispatch({ type: 'moveWindSource', coords, id });
    }
  });
}

setupWindSourceListeners();
