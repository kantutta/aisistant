import firebase from "firebase";
import "firebase/auth";

/* Put here your own firebase config */
const app = firebase.initializeApp({
  apiKey: "AIzaSyA4KYfiqd_mek2VuqVuRX9dfoby1lVn4Rc",
  authDomain: "aisistant-177ee.firebaseapp.com",
  databaseURL: "https://aisistant-177ee-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "aisistant-177ee",
  storageBucket: "aisistant-177ee.appspot.com",
  messagingSenderId: "366158386758",
  appId: "1:366158386758:web:35d2c2430caed0de51dc47"
});

const db = firebase.firestore();
const rdb = firebase.database();
const sdb = firebase.storage();
const auth = app.auth()

export {db, auth, rdb, sdb}
export default app