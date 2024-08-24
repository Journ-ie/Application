// import functions from SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

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

// Set an authentication state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, you can access user information here
        console.log('User is signed in');

        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';

        // Optionally, redirect to a protected page
        if (window.location.pathname === '/sign-in.html') {
            window.location.href = '/journal.html'; // Redirect to journal if already signed in
        }
    } else {
        // No user is signed in
        console.log('No user is signed in');
        console.log(window.location.pathname);
        // Optionally, redirect to login page
        if (window.location.pathname === '/journal.html' || window.location.pathname === '/log.html' || window.location.pathname === '/setting.html') {
            window.location.href = '/sign-in.html';
        }
    }
});

export { auth, db };