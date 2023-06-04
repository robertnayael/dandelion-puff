import { Action, State } from './types';
import * as selectors from './selectors';

const initialState: State = {
  initialized: false,
  grid: {
    width: NaN,
    height: NaN,
    cellSize: NaN,
  },
  windBlow: null,
  debug: {},
};

export function reducer(state = initialState, action: Action): State {
  if (action.type !== 'nextFrame') {

    console.log(action)
  }
  switch (action.type) {
    
    case 'initialize': {
      return {
        ...state,
        initialized: true,
        grid: action.grid,
      };
    }

    case 'blowStarted': {
      return {
        ...state,
        windBlow: {
          start: action.where,
          end: action.where,
        }
      };
    }

    case 'blowEndpointMoved': {
      if (!state.windBlow) return state;
      return {
        ...state,
        windBlow: {
          ...state.windBlow,
          end: action.where,
        },
      };
    }

    case 'blowEnded': {
      return {
        ...state,
        windBlow: null,
      };
    }

    case 'nextFrame': {
      if (!state.initialized) return state;
      return {
        ...state,
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
