import * as firebase from 'firebase';
import config from 'react-native-config';

// PROD SETTINGS
var dbConfig = {
  apiKey: config.API_KEY,
  authDomain: config.AUTH_DOMAIN,
  databaseURL: config.DATABASE_URL,
  projectId: config.PROJECT_ID,
  storageBucket: config.STORAGE_BUCKET,
  messagingSenderId: config.MESSAGE_SENDER_ID,
};

// console.log('-initializing firebase-');
// console.log(config.ENVIRONMENT);
// console.log(config.FIREBASE_CONFIG);
firebase.initializeApp(dbConfig);

// TEST SETTINGS
// var config = {
//   apiKey: "AIzaSyDVzOwEC6eCNFCMdHp-ONk_kj8WeBJtNvk",
//   authDomain: "lykke-test.firebaseapp.com",
//   databaseURL: "https://lykke-test.firebaseio.com",
//   projectId: "lykke-test",
//   storageBucket: "lykke-test.appspot.com",
//   messagingSenderId: "784972485626"
// };
// firebase.initializeApp(config);

testDatabase = () => {
  try {
  console.log('writing to database...');
  firebase.database().ref('/experiment').set({test: true});
  } catch(error) {
    console.log('failed to write to database '+error);
  }
}

export default firebase;
export { testDatabase };