import firebase from '../firebase';
import * as Types from '../actions/types'
import FBSDK, { AccessToken, LoginManager } from 'react-native-fbsdk';
import store from '../store';
import { isInteger, isFloat, isNumber, isSameDay } from '../util'
import { CHECKIN_COMPLETE, CHECKIN_INCOMPLETE } from '../common/constants';

export const refreshStore = () => {
  return {
    type: Types.REFRESH
  }
}

export const getBusinessesSuccess = (businesses) => {
  return {
    type: Types.GET_BUSINESSES,
    businesses
  }
}

export const getRoutesSuccess = (routes) => {
  return {
    type: Types.GET_ROUTES_SUCCESS,
    routes
  }
}

export const getInventorySuccess = (itemmaster) => {
  return {
    type: Types.GET_ITEMMASTER_SUCCESS,
    itemmaster: itemmaster
  }
}

export const loginSuccess = (user) => {
  return {
    type: Types.LOGIN_SUCCESS,
    user,
  }
}

export const loginFailure = (user) => {
  return {
    type: Types.LOGIN_FAILURE,
    user,
  }
}

export const signOut = () => {
  return {
    type: Types.SIGN_OUT,
  }
}

export const selectRouteSuccess = (routeName) => {
  return {
    type: Types.SELECT_ROUTE_SUCCESS,
    name: routeName
  }
}


export const createCheckinSuccess = (checkin) => {
  return {
    type: Types.CREATE_CHECKIN_SUCCESS,
    checkin: checkin,
  }
}

export const retrievedCheckinSuccess = (checkin) => {
  return {
    type: Types.RETRIEVED_CHECKIN_SUCCESS,
    checkin: checkin,
  }
}

export const currentCheckinInfo = (key) => {
  return {
    type: Types.CURRENT_CHECKIN_INFO,
    checkinKey: key,
  }
}

export const checkingUpdateSuccess = (checkin) => {
  return {
    type: Types.CHECKIN_UPDATE_SUCCESS,
    checkin: checkin,
  }
}

export const getCheckinsSuccess = (checkins) => {
  return {
    type: Types.GET_CHECKINS_SUCCESS,
    checkins
  }
}


export const selectRoute = (routeName) => {
  return (dispatch) => {
    dispatch(selectRouteSuccess(routeName));
  }
}

export const completeCheckinSuccess = status => {
  return {
    type: Types.CHECKIN_COMPLETE,
    status: status,
  }
}


export const addBusinessToRouteSuccess = (routeName, businessName) => {
  return {
    type: Types.ADD_BUSINESS,
    routeName: routeName,
    businessName: businessName
  }
}

export const updateRouteInSession = (businesses) => {
  return {
    type: Types.ADD_BUSINESS_TO_ROUTE,
    businesses,
  }
}


export const isLogin = (isLogin) => {
  return {
    type: Types.IS_LOGIN,
    isLogin
  };
}

export const login = () => {
  return (dispatch) => {
    dispatch(isLogin(true));
    _facebook_login();
  }
}

export const getSessionSuccess = (session) => {
  return {
    type: Types.GET_SESSION_SUCCESS,
    session
  }
}

export const refresh = () => {
  return (dispatch) => {
    console.log('YYY dispatching refreshStore!');
    dispatch(refreshStore());
  }
}

export const addBusinessToRoute = (user, businessName) => {
  return (dispatch) => {
    if (!businessName || _.isEmpty(user)) {
      throw new Error(`Must provide business to add ${businessName} ${user.email}`);
    }

    firebase.database().ref('sessions').once('value', snapshot => {
      if (!snapshot.exists()) {
        throw new Error('Could not find session for user');
      }

      snapshot.forEach(item => {
        if (item.val().email === user.email && item.val().isLoggedIn) {
          if (!item.val().route) {
            firebase.database().ref('sessions/' + item.key).update({
              route: {
                businesses: {
                  [businessName]: true
                }
              }
            });
            // dispatch(updateRouteInSession({ businesses: [businessName] }));
          } else {
            const newBusinesses = _.cloneDeep(item.val().route.businesses);
            newBusinesses[`${businessName}`] = true;
            firebase.database().ref('sessions/' + item.key + '/route').update({
              businesses: newBusinesses
            });
            // dispatch(updateRouteInSession(newBusinesses));
            return;
          }
        }
      });
    });
  }
}

export const removeBusinessFromRoute = (user, businessName) => {
  return (dispatch) => {
    if (!businessName || _.isEmpty(user)) {
      throw new Error(`Must provide business to add ${businessName} ${user.email}`);
    }

    firebase.database().ref('sessions').once('value', snapshot => {
      if (!snapshot.exists()) {
        throw new Error('Could not find session for user');
      }

      snapshot.forEach(item => {
        if (item.val().email === user.email && item.val().isLoggedIn) {
          if (!item.val().route) {
            throw new Error(`Route does not exist in`);
          } else {
            const businesses = item.val().route.businesses;
            if (!businesses || !businesses[businessName]) {
              throw new Error(`${businessName} does not exist`);
            }
            delete businesses[businessName]
            console.log('-new business list-');
            console.log(businesses);
            firebase.database().ref('sessions/' + item.key + '/route').update({
              businesses: businesses
            });
            dispatch(updateRouteInSession(businesses));
            return;
          }
        }
      });
    });
  }
}

export const createCheckin = (businessKey, userKey, timeCreated) => {
  return (dispatch) => {
    firebase.database().ref('checkins')
      .orderByChild('timeCreated')
      .once('value', function (snapshot) {
        let found = false;
        snapshot.forEach(item => {
          let currDate = new Date(item.val().timeCreated);
          if (isSameDay(new Date(timeCreated), currDate)
            && item.val().businessKey === businessKey
            && item.val().userKey === userKey) {

            let checkinData = {};
            checkinData[item.key] = {
              'businessKey': item.val().businessKey,
              'userKey': item.val().userKey,
              'status': item.val().status,
              'order': item.val().order,
              'payment': item.val().payment,
              'timeCreated': item.val().timeCreated,
            }
            dispatch(currentCheckinInfo(item.key));
            dispatch(retrievedCheckinSuccess(checkinData));
            found = true;
            return;
          }
        });

        if (!found) {
          console.log('XXX CREATING CHECKING ' + timeCreated);
          const checkinNode = firebase.database().ref('checkins').push();
          checkinNode.set({
            'businessKey': businessKey,
            'userKey': userKey,
            'status': CHECKIN_INCOMPLETE,
            'timeCreated': new Date(timeCreated).getTime(),
          });
          console.log('CREATED NEW CHECKING ' + JSON.stringify(checkinNode));
          dispatch(createCheckinSuccess(checkinNode));
          dispatch(currentCheckinInfo(checkinNode.key));
        }
      });
  }
}

export const completeCheckin = (checkinKey) => {
  return (dispatch) => {
    if (!checkinKey) {
      console.error('Invalid checkin key ' + checkin);
      return;
    }

    let updates = {
      'status': CHECKIN_COMPLETE,
      'timeCompleted': new Date().getTime(),
    }
    firebase.database().ref('checkins/' + checkinKey).update(updates);
    dispatch(completeCheckinSuccess(CHECKIN_COMPLETE));
  }
}

export const saveOrder = (checkinKey, order, itemmaster) => {
  return (dispatch) => {
    console.log(order);
    console.log(checkinKey);
    if (!validOrder(order)) {
      console.log('Invalid order');
      return;
    }

    const checkinRef = firebase.database().ref('checkins/' + checkinKey);

    checkinRef.transaction(function (checkin) {
      console.log('inside transaction - ' + JSON.stringify(checkin));
      if (checkin) {
        checkin['order'] = order;
        Object.keys(itemmaster).forEach(key => {
          firebase.database().ref('itemmaster/' + key).update({
            quantity: itemmaster[key].quantity
          });
        });

        console.log('updated itemmaster');
      }
      return checkin;
    });
  }
}

export const updatePayment = (checkinKey, amount) => {
  return (dispatch) => {
    if (!isNumber(amount)) {
      throw new Error(`Invalid payment amount ${amount}`)
      return;
    }

    firebase.database().ref('checkins/' + checkinKey + '/payment').update({
      'amount': amount
    });
  }
}

validOrder = (order) => {
  Object.keys(order).forEach(key => {
    if (!isInteger(order[key])) {
      return false;
    }
  });

  return true;
}

const createSession = (email, callback) => {
  firebase.database().ref('sessions').once('value', snapshot => {
    if (!snapshot.exists()) {
      firebase.database().ref('sessions').push().set({
        email: email,
        isLoggedIn: true,
        loginTime: new Date().getTime(),
      });
    } else {
      let existingSession = false;
      console.log('existing session ' + existingSession);
      snapshot.forEach(item => {
        console.log(item.val());
        if (item.val().email === email && item.val().isLoggedIn) {
          if (callback) {
            callback();
          }
          existingSession = true;
          return;
        }
      });

      if (!existingSession) {
        firebase.database().ref('sessions').push().set({
          email: email,
          isLoggedIn: true,
          loginTime: new Date().getTime(),
        });

        if (callback) {
          callback();
        }
      }
    }
  });
}

export const logout = (user) => {
  return (dispatch) => {
    firebase.database().ref('sessions').once('value', snapshot => {
      snapshot.forEach(item => {
        if (item.val().email === user.email && item.val().isLoggedIn) {
          firebase.database().ref('sessions/' + item.key).update({
            isLoggedIn: false,
            logoutTime: new Date().getTime()
          });
        }
        return;
      });

      firebase.auth().signOut().then(function() {
        dispatch(signOut());
      }).catch(function (err) {
        console.error(`Error signing out ${JSON.stringify(err)}`);
      });
    });
  }
}

_facebook_login = () => {
  LoginManager.logInWithReadPermissions(['public_profile', 'email'])
    .then((result) => {
      if (result.isCancelled) {
        return Promise.reject(new Error('The user cancelled the request'));
      }
      // Retrieve the access token
      return AccessToken.getCurrentAccessToken();
    })
    .then((data) => {
      // Create a new Firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
      // console.log(credential);
      // Login with the credential
      return firebase.auth().signInWithCredential(credential);
    })
    .then((user) => {
      // If you need to do anything with the user, do it here
      // The user will be logged in automatically by the
      // `onAuthStateChanged` listener we set up in App.js earlier
    })
    .catch((error) => {
      const { code, message } = error;
      console.error(`error logging in ${error}`);
      // For details of error codes, see the docs
      // The message contains the default Firebase string
      // representation of the error
    });
}
