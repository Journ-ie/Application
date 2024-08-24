// import functions from SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

// firebase config
const firebaseConfig = {
    apiKey: 'AIzaSyDCXbyXVfDETvTfHKXovWJsDkoKuWebS-Y',
    authDomain: 'journie-d4114.firebaseapp.com',
    projectId: 'journie-d4114',
    storageBucket: 'journie-d4114.appspot.com',
    messagingSenderId: '200463028766',
    appId: "1:200463028766:web:9cfcd1973859b362fbd40f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);  

export { auth, db };