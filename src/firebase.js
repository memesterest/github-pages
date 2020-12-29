import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCexygyC1-vduIRJsTF0kUKSyj0Wmfo26g",
    authDomain: "memesterest-1fbe9.firebaseapp.com",
    databaseURL: "https://memesterest-1fbe9.firebaseio.com",
    projectId: "memesterest-1fbe9",
    storageBucket: "memesterest-1fbe9.appspot.com",
    messagingSenderId: "49139063816",
    appId: "1:49139063816:web:f7052c4feb807d5f8b05bd",
    measurementId: "G-5RXK2Z8DM8"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };