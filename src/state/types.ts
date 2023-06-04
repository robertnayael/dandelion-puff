import { Point } from '../types';

export type State = {
  initialized: boolean;
  grid: {
    width: number;
    height: number;
    cellSize: number;
  },
  windBlow: null | {
    start: Point;
    end: Point;
  },
  debug: Record<string, any>;
};


export type Action =
  { type: 'initialize', grid: State['grid'] }
| { type: 'nextFrame', deltaTime: number }
| { type: 'blowStarted', where: Point }
| { type: 'blowEndpointMoved', where: Point }
| { type: 'blowEnded', where: Point }
