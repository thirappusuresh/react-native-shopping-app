import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyACiGyi2-45QLTmBrtSMsEgrCeJ5NNupgc",
  authDomain: "rn-shopping-1e646.firebaseapp.com",
  databaseURL: "https://rn-shopping-1e646.firebaseio.com",
  projectId: "rn-shopping-1e646",
  storageBucket: "rn-shopping-1e646.appspot.com",
  appId: "1:184577136915:android:994081b1f2b467b67fe2e6"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };