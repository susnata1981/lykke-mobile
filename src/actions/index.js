import firebase from '../firebase';
import * as Types from '../actions/types'
import FBSDK, { AccessToken, LoginManager } from 'react-native-fbsdk';
import store from '../store';
import { isInteger, isFloat, isNumber } from '../util'
import { CHECKIN_COMPLETE, CHECKIN_INCOMPLETE } from '../common/constants';

refreshStore = () => {
  return {
    type: Types.REFRESH
  }
}

getBusinessesSuccess = (businesses) => {
  return {
    type: Types.GET_BUSINESSES,
    businesses
  }
}

getRoutesSuccess = (routes) => {
  return {
    type: Types.GET_ROUTES_SUCCESS,
    routes
  }
}

getInventorySuccess = (itemmaster) => {
  return {
    type: Types.GET_ITEMMASTER_SUCCESS,
    itemmaster: itemmaster
  }
}

loginSuccess = (user) => {
  return {
    type: Types.LOGIN_SUCCESS,
    user,
  }
}

loginFailure = (user) => {
  return {
    type: Types.LOGIN_FAILURE,
    user,
  }
}

signOut = () => {
  return {
    type: Types.SIGN_OUT,
  }
}

selectRouteSuccess = (routeName) => {
  return {
    type: Types.SELECT_ROUTE_SUCCESS,
    name: routeName
  }
}


createCheckinSuccess = (checkin) => {
  return {
    type: Types.CREATE_CHECKIN_SUCCESS,
    checkin: checkin,
  }
}

retrievedCheckinSuccess = (checkin) => {
  return {
    type: Types.RETRIEVED_CHECKIN_SUCCESS,
    checkin: checkin,
  }
}

currentCheckinInfo = (key) => {
  return {
    type: Types.CURRENT_CHECKIN_INFO,
    checkinKey: key,
  }
}

checkingUpdateSuccess = (checkin) => {
  return {
    type: Types.CHECKIN_UPDATE_SUCCESS,
    checkin: checkin,
  }
}

getCheckinsSuccess = (checkins) => {
  return {
    type: Types.GET_CHECKINS_SUCCESS,
    checkins
  }
}

export const getBusinesses = () => {
  return (dispatch) => {
    firebase.database().ref('businesses').once('value', function (snapshot) {
      let result = {};

      snapshot.forEach(function (item) {
        result[item.key] = {
          name: item.key,
          address: item.val().address,
          outstandingBalance: item.val().outstanding_balance,
          lat: item.val().lat,
          lng: item.val().lng,
          time_created: item.val().time_created,
        }
      });
      dispatch(getBusinessesSuccess(result));
    });
  }
}

export const getRoutes = (user) => {
  return (dispatch) => {
    const routes = {};
    let routesPromise = firebase.database().ref('routes').once('value', function (snapshot) {
      snapshot.forEach(function (item) {
        if (item.val().assignment
          && item.val().assignment.assignee
          && item.val().assignment.assignee === user.key) {
          routes[item.key] = {
            businesses: item.val().businesses,
            assignment: item.val().assignment,
            time_created: item.val().time_created,
          }
        }
      });
      dispatch(getRoutesSuccess(routes));
    });
  }
}

export const getItemMaster = () => {
  return (dispatch) => {
    const inventory = {};
    firebase.database().ref('itemmaster').on('value', function (snapshot) {
      snapshot.forEach(function (item) {
        inventory[item.key] = {
          id: item.val().id,
          name: item.key,
          quantity: item.val().quantity,
          price: item.val().price,
          timeCreated: item.val().time_created,
        }
      });
      dispatch(getInventorySuccess(inventory));
    });
  }
}

export const selectRoute = (routeName) => {
  return (dispatch) => {
    dispatch(selectRouteSuccess(routeName));
  }
}

export const getCheckins = (userKey) => {
  return (dispatch) => {
    firebase.database().ref('checkins').orderByChild('timeCreated').on('value', snapshot => {
      const checkins = {};
      snapshot.forEach(item => {
        let checkin = {};
        if (item.val().userKey === userKey) {
          checkin['key'] = item.key;
          checkin['userKey'] = item.val().userKey;
          checkin['businessKey'] = item.val().businessKey;
          checkin['order'] = item.val().order;
          checkin['payment'] = item.val().payment;
          checkin['status'] = item.val().status;
          checkin['timeCreated'] = item.val().timeCreated;
          checkin['timeCompleted'] = item.val().timeCompleted;
          checkins[item.key] = checkin;
        }
      });
      dispatch(getCheckinsSuccess(checkins));
    });
  }
}

function isSameDay(d1, d2) {
  return d1.getDate() === d2.getDate()
    && d1.getMonth() === d2.getMonth()
    && d1.getFullYear() === d2.getFullYear();
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

            console.log('XXX FOUND EXISTING CHECKING ' + JSON.stringify(item.val()));
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

function completeCheckinSuccess(status) {
  return {
    type: Types.CHECKIN_COMPLETE,
    status: status,
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
    // dispatch(createCheckinSuccess());
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

    console.log(`saving order ${JSON.stringify(order)} ${JSON.stringify(itemmaster)}`);
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

    // .update({
    //   'order': order
    // });

    // dispatch(checkingUpdateSuccess())
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
    // dispatch(checkingUpdateSuccess())
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

confirmOrder = (order) => {
  console.log('TODO: Confirm order');
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
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.database().ref('users').once('value', snapshot => {
          let found = false;
          snapshot.forEach(item => {
            if (item.val().email === user.email) {
              found = true;

              dispatch(loginSuccess({
                key: item.key,
                isLogin: false,
                firstname: item.val().firstname,
                lastname: item.val().lastname,
                email: item.val().email,
                createdAt: item.val().createdAt,
              }));
            }
          });
          if (!found) {
            dispatch(loginFailure({
              email: undefined,
              // isLogin: false,
              createdAt: undefined,
              firstname: undefined,
              lastname: undefined,
              createdAt: undefined
            }));
          }
        });
      }
    });
    _facebook_login();
  }
}

export const logout = () => {
  return (dispatch) => {
    firebase.auth().signOut().then(function () {
      dispatch(SIGN_OUT);
    }).catch(function (err) {
      console.error(`Error signing out ${JSON.stringify(err)}`);
    })
  }
}

export const refresh = () => {
  return (dispatch) => {
    console.log('YYY dispatching refreshStore!');
    dispatch(refreshStore());
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
