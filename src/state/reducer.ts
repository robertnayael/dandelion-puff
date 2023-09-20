import { Action, State, WindTunnel } from './types';
import { SimpleEntity, Vector2, VectorField } from '../linalg';
import * as selectors from './selectors';
import { Trail } from '../linalg/Trail';

const initialState: State = {
  initialized: false,
  grid: {
    width: NaN,
    height: NaN,
    cellSize: NaN,
  },
  vectorField: VectorField.empty(),
  windTunnels: [],
  entities: Array(1).fill(null).map(() => new SimpleEntity(200 + Math.round(Math.random() * 500), 200 + Math.round(Math.random() * 500))),
  trails: [
    new Trail(500, 500)
  ],
  debug: {},
};

export function reducer(state = initialState, action: Action): State {
  if (action.type !== 'nextFrame') {
    // console.log(action)
  }
  switch (action.type) {
    
    case 'initialize': {
      return {
        ...state,
        initialized: true,
        grid: action.grid,
        vectorField: VectorField.create({
          width: action.grid.width, 
          height: action.grid.height, 
          cellSize: action.grid.cellSize,
        }),
      };
    }

    case 'addWindSource': {
      const { coords: from, id } = action;
      const { windTunnels } = state;
      if (windTunnels.some(t => t.id === id)) {
        return state;
      }
      const newTunnel: WindTunnel = {
        id,
        from,
        wind: Vector2.zero(),
      };
      return {
        ...state,
        windTunnels: windTunnels.concat(newTunnel),
      };
    }

    case 'moveWindSource': {
      const { coords, id } = action;
      const windTunnels = [...state.windTunnels];
      const index = windTunnels.findIndex(t => t.id === id);
      const tunnel = windTunnels[index];
      if (!tunnel) {
        return state;
      }
      const wind = Vector2.subtract(coords, tunnel.from).multiply(-1)
      const updatedSource = { ...tunnel, wind };
      windTunnels[index] = updatedSource;
      return {
        ...state,
        windTunnels,
      };
    }

    case 'removeWindSource': {
      const { id } = action;
      const windTunnels = state.windTunnels.filter(t => t.id !== id);
      return {
        ...state,
        windTunnels,
      };
    }

    case 'nextFrame': {
      if (!state.initialized) return state;
      const WIND_INCREASE_RATE = 1; // [px/s]
      const windIncreaseRate = WIND_INCREASE_RATE * action.deltaTime / 1000;
      // const vectorField = state.vectorField.copy().applyWindTunnels(state.windTunnels, windIncreaseRate);
      const vectorField = state.vectorField.copy().applyWindTunnels(state.windTunnels, windIncreaseRate);
      const entities = state.entities
        .map(entity => {
          const wind = vectorField.getVectorAtPixelPosition(entity);
          if (wind && !!wind.length) {
            // entity.setAcceleration(wind.vector.copy().multiply(1/5))
            entity.setAcceleration(wind.copy().setLength(0.1))
          }
          return entity;
        });
      entities.forEach(e => e.update());

      const trails = state.trails
      .map(trail => {
        const wind = vectorField.getVectorAtPixelPosition(trail);
        if (wind && !!wind.length) {
          // entity.setAcceleration(wind.vector.copy().multiply(1/5))
          trail.setAcceleration(wind.copy().setLength(0.1))
        }
        return trail;
      });
      trails.forEach(e => e.update());

      return {
        ...state,
        vectorField,
        entities,
        debug: {
          ...state.debug,
          deltaTime: action.deltaTime,
        },
      };
    }

    default: {
      return state;
    }

  }
};
