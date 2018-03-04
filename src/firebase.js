import * as firebase from 'firebase';

// PROD SETTINGS
// var config = {
//   apiKey: "AIzaSyCerTXhFJVrxLwU6BXjkuG2v4iK88EXE4U",
//   authDomain: "lykke-1e98b.firebaseapp.com",
//   databaseURL: "https://lykke-1e98b.firebaseio.com",
//   projectId: "lykke-1e98b",
//   storageBucket: "lykke-1e98b.appspot.com",
//   messagingSenderId: "91650177123"
// };
// firebase.initializeApp(config);

// TEST SETTINGS
var config = {
  apiKey: "AIzaSyDVzOwEC6eCNFCMdHp-ONk_kj8WeBJtNvk",
  authDomain: "lykke-test.firebaseapp.com",
  databaseURL: "https://lykke-test.firebaseio.com",
  projectId: "lykke-test",
  storageBucket: "lykke-test.appspot.com",
  messagingSenderId: "784972485626"
};
firebase.initializeApp(config);

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