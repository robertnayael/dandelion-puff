import { createStore } from 'redux';

import { reducer } from './state';

const store = createStore(reducer);
const dispatch = store.dispatch;
const getState = store.getState;

export default store;
export { dispatch, getState };
