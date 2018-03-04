import firebase from '../firebase';
import store from '../store';

export default class LykkeService {

  static getRouteList() {
    let routesPromise = firebase.database().ref('/routes').once('value');
    let businessListPromise = LykkeService.getBusinessList();

    let resultPromise = new Promise((resolve, reject) => {
      routesPromise.then(function (snapshot) {
        resolve(result);
      });
    }).catch(err => {
      console.error(err);
      reject(err);
    });

    Promise.all([routesPromise, businessListPromise]).then((values) => {
      const routeSnapshot = values[0];
      const businessList = values[1];
      let result = {};

      routeSnapshot.forEach(function (item) {
        result[item.key] = {
          businesses: item.val().businesses,
          assignment: item.val().assignment,
          time_created: item.val().time_created,
        }
      });
      return result;
    }).catch(error => {
      console.error(error);
    });
  }

  static getBusinessList() {
    console.log('returning promise for business list');
    let result = {}
    let promise = firebase.database().ref('businesses').once('value');

    promise.then(snapshot => {
      console.log('received result from firebase');
      snapshot.forEach(item => {
        result[item.key] = {
          address: item.val().address,
          lat: item.val().lat,
          lng: item.val().lng,
        }
      });
    }).catch(err => {
      console.error(err);
    });

    return Promise.all([promise]).then((resolve, reject) => {
      return result;
    }).catch(err => { console.log(err) });
  }
}
