import * as Types from '../actions/types';
import { combineReducers } from 'redux';
import _ from 'lodash';

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
    case Types.ADD_BUSINESS:
      console.log('--add business--');
      // console.log(state);
      console.log('--before--');
      const route = _.cloneDeep(_.filter(state, item => item.name === action.routeName)[0]);
      console.log(route);
      route.businesses[`${action.businessName}`] = true;
      route.assignment = state[action.routeName].assignment;
      const o = {};
      o[`${route.name}`] = route;
      console.log('-new route-');
      console.log(o);
      const newRoutes = Object.assign({}, state, o);
      console.log(newRoutes);
      return newRoutes;
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
      return action.checkins;
    case Types.CREATE_CHECKIN_SUCCESS:
    case Types.CHECKIN_UPDATE_SUCCESS:
    default:
      return state;
  }
}

function session(state, action) {
  if (!state) {
    return null;
  }

  switch(action.type) {
    case Types.ADD_BUSINESS_TO_ROUTE:
      return Object.assign({}, state, {route: { businesses: action.businesses }});
    case Types.GET_SESSION_SUCCESS:
      return action.session;
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
    session: session,
    refresh: refresh,
  });
}

export { getRootReducer }