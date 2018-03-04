import * as Types from '../actions/types';
import { combineReducers } from 'redux';

function businesses(state, action) {
  if (!state) {
    return null;
  }

  switch (action.type) {
    case Types.GET_BUSINESSES:
      return action.businesses;
    default:
      return state;
  }
}

function routes(state, action) {
  if (!state) {
    return null;
  }

  switch(action.type) {
    case Types.GET_ROUTES_SUCCESS:
      return action.routes;
    default:
      return state;
  }
}

function selectedRoute(state, action) {
  if (!state) {
    return null;
  }

  switch(action.type) {
    case Types.SELECT_ROUTE_SUCCESS:
      return action.name;
    default:
      return state;
  }
}

function user(state, action) {
  if (!state) {
    return null;
  }

  switch(action.type) {
    case Types.LOGIN_SUCCESS:
      return action.user;
    case Types.LOGIN_FAILURE:
    case Types.SIGN_OUT:
      return {
        isLogin: false,
        key: undefined,
        email: undefined,
        firstname: undefined,
        lastname: undefined,
        createdAt: undefined,
      };    
    case Types.IS_LOGIN:
      return Object.assign({}, state, { isLogin : action.isLogin });
    default:
      return state;
  }
}

function itemmaster(state, action) {
  if (!state) {
    return null;
  }

  switch(action.type) {
    case Types.GET_ITEMMASTER_SUCCESS:
      return action.itemmaster
    default:
      return state;
  }
}

function selectedCheckinKey(state, action) {
  if (!state) {
    return null;
  }

  switch(action.type) {
    case Types.CURRENT_CHECKIN_INFO:
      return action.checkinKey;
    default:
      return state;
  }
}

function refresh(state, action) {
  if (!state) {
    return null;
  }

  switch(action.type) {
    case Types.REFRESH:
      return true;
    default:
      return state;
  }
}

function checkins(state, action) {
  if (!state) {
    return null;
  }

  switch(action.type) {
    case Types.GET_CHECKINS_SUCCESS:
      // let newCheckins = Object.assign({}, state, action.checkins);
      return action.checkins;
    // case Types.RETRIEVED_CHECKIN_SUCCESS:
    //   const newCheckin = action.checkin;
    //   let existingCheckins = Object.keys(state).filter(item => item.key === newCheckin.key);
    //   if (existingCheckins.length > 0) {
    //     console.log('Checking data exists!');
    //     return action.checkin;
    //   }
    //   return Object.assign({}, state, newCheckin);
    // case Types.CHECKIN_COMPLETE: 
    //   let selected = Object.assign({}, state.selected, {'status': action.status});
    //   return Object.assign({}, state, { selected: selected });
    case Types.CREATE_CHECKIN_SUCCESS:
    case Types.CHECKIN_UPDATE_SUCCESS:
    default:
      return state;
  }
}

function getRootReducer(navReducer) {
  return combineReducers({
    businesses: businesses,
    routes: routes,
    selectedRoute: selectedRoute,
    user: user,
    itemmaster: itemmaster,
    checkins: checkins,
    selectedCheckinKey: selectedCheckinKey,
    navigationState: navReducer,
    refresh: refresh,
  });
}

export { getRootReducer }