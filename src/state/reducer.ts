import { Action, State } from './types';

const initialState: State = {
  initialized: false,
  grid: {
    width: NaN,
    height: NaN,
    cellSize: NaN,
  },
  debug: {},
};

export function reducer(state = initialState, action: Action): State {
  
  switch (action.type) {
    
    case 'initialize': {
      return {
        ...state,
        initialized: true,
        grid: action.grid,
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
