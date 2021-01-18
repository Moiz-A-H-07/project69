import * as firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyBz2M9S2YO-ciyGW7bw9xs0JkVATo-NScs",
    authDomain: "library-app-6c281.firebaseapp.com",
    projectId: "library-app-6c281",
    storageBucket: "library-app-6c281.appspot.com",
    messagingSenderId: "533647075926",
    appId: "1:533647075926:web:53bd1805ed4349ef75e9f7"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();
