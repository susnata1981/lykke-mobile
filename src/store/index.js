import { createStore, applyMiddleware } from 'redux';
import { getRootReducer } from '../reducers/index';
import { AppNavigator } from '../config/Routes'
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const INITIAL_STATE = { 
  businesses: {}, 
  routes: {},
  selectedRoute: {},
  itemmaster: {},
  checkins: {},
  selectedCheckinKey: {},
  user: {
    isLogging: false,
    key: undefined,
    firstname: undefined,
    lastname: undefined,
    email: undefined,
    createdAt: undefined,
  },
  refresh: {},
}

const navReducer = (state, action) => {
  let newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state;
}

function configureStore(
  navReducer,
  initialState = INITIAL_STATE) { 
  return createStore(
    getRootReducer(navReducer), 
    initialState, 
    applyMiddleware(thunk, logger));
}

const store = configureStore(navReducer);
export default store;