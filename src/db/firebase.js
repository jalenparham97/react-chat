import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const config = {
  apiKey: "AIzaSyBPnyVOW_2llIc62DHoaEPunKKeR5i-QyI",
  authDomain: "react-slack-clone-c7583.firebaseapp.com",
  databaseURL: "https://react-slack-clone-c7583.firebaseio.com",
  projectId: "react-slack-clone-c7583",
  storageBucket: "react-slack-clone-c7583.appspot.com",
  messagingSenderId: "9354904405"
};
firebase.initializeApp(config);

export default firebase