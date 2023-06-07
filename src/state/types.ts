import { SimpleEntity, Vector2, VectorField } from '../linalg';

export type WindTunnel = {
  from: Vector2;
  wind: Vector2;
  id: string;
};

export type State = {
  initialized: boolean;
  grid: {
    width: number;
    height: number;
    cellSize: number;
  },
  vectorField: VectorField,
  windTunnels: WindTunnel[];
  entities: SimpleEntity[];
  debug: Record<string, any>;
};


export type Action =
  { type: 'initialize'; grid: State['grid'] }
| { type: 'nextFrame'; deltaTime: number }
| { type: 'addWindSource'; coords: Vector2, id: string }
| { type: 'moveWindSource'; coords: Vector2; id: string }
| { type: 'removeWindSource'; id: string };
