// import functions from SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

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

onAuthStateChanged(auth, (user) => {
    const loadingElement = document.getElementById('loading');
    const mainContentElement = document.getElementById('main-content');

    if (user) {
        console.log('User is signed in');

        // Breaks registration if uncommented, TODO 
        /*
        if (window.location.pathname === '/sign-in.html') {
            window.location.href = '/journal.html';
        } */

        // Show main content if not signing out
        if (loadingElement && mainContentElement) {
            loadingElement.style.display = 'none';
            mainContentElement.style.display = 'block';
        }
    
    } else {
        console.log('No user is signed in');

        if (window.location.pathname === '/journal.html' || window.location.pathname === '/log.html' || window.location.pathname === '/setting.html') {
            window.location.href = '/sign-in.html';
        } else {
            if (loadingElement && mainContentElement) {
                loadingElement.style.display = 'none';
                mainContentElement.style.display = 'block';
            }
        }
    }
});

export { auth, db };