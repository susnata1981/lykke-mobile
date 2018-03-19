import firebase from '../firebase'
import store from '../store'
import {
  getBusinessesSuccess,
  getRoutesSuccess,
  loginFailure,
  loginSuccess,
  getCheckinsSuccess,
  getSessionSuccess,
  getInventorySuccess,
} from './index'
import _ from 'lodash'

const LISTENERS = [
  {
    entity: 'businesses',
    listener: request => getEntity(request),
    onResponse: result => getBusinessesSuccess(result),
  },
  {
    entity: 'routes',
    listener: (request) => getRoutesForUser(request),
    onResponse: result => getRoutesSuccess(result),
  },
  {
    entity: 'checkins',
    listener: request => getEntity(request),
    onResponse: result => getCheckinsSuccess(result),
  },
  {
    entity: 'sessions',
    listener: request => getSession(request),
    onResponse: result => getSessionSuccess(result),
  },
  {
    entity: 'itemmaster',
    listener: request => getEntity(request),
    onResponse: result => getInventorySuccess(result),
  },
]

const getEntity = ({ entity, user, onResponse }) => {
  firebase.database().ref(entity).on('value', snapshot => {
    let result = {};
    snapshot.forEach(item => {
      result[item.key] = item.val()
    });

    store.dispatch(onResponse(result));
  });
}

const getRoutesForUser = ({ entity, user, onResponse }) => {
  if (!user) {
    return
  }

  const routes = {};
  firebase.database().ref(entity).on('value', snapshot => {
    snapshot.forEach(item => {
      if (item.val().assignment
        && item.val().assignment.assignee
        && item.val().assignment.assignee === user.key) {
        routes[item.key] = item.val()
      }
    });
    store.dispatch(onResponse(routes));
  });
}

const getSession = ({ entity, user, onResponse }) => {
  firebase.database().ref(entity).on('value', snapshot => {
    if (!snapshot.exists()) {
      throw new Error('Session does not exist');
    }

    snapshot.forEach(item => {
      if (item.val().email === user.email && item.val().isLoggedIn) {
        store.dispatch(onResponse(item.val()));
        return;
      }
    });
  });
}

const addLoginStatusListener = (callback = () => { }) => {
  firebase.auth().onAuthStateChanged(user => {

    if (user) {
      firebase.database().ref('users').once('value', snapshot => {
        let found = false;
        snapshot.forEach(item => {
          if (item.val().email === user.email) {
            found = true;
            console.log('-found user -');
            console.log(item.val());
            createSession(user.email, () => {
              store.dispatch(loginSuccess({
                key: item.key,
                isLogin: false,
                firstname: item.val().firstname,
                lastname: item.val().lastname,
                email: item.val().email,
                timeCreated: item.val().createdAt,
              }));

              callback();
            });
            return;
          }
        });

        if (!found) {
          store.dispatch(loginFailure({
            email: undefined,
            createdAt: undefined,
            firstname: undefined,
            lastname: undefined,
            createdAt: undefined
          }));
        }
      });
    }
  });
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
      snapshot.forEach(item => {
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


export const setupListeners = () => {
  addLoginStatusListener(() => {
    _.forEach(LISTENERS, (item) => {
      console.log(`setting up listener for ${item.entity}`);
      item.listener({ entity: item.entity, user: store.getState().user, onResponse: item.onResponse });
    });
  });
}
