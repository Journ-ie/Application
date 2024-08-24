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


// Variable to track whether a user is signing in
let isSigningIn = false;

// Check for sign in form submission
const signInForm = document.querySelector('#sign-in-form');
if (signInForm) {
    signInForm.addEventListener('submit', (event) => {
        isSigningIn = true;
    });
}

onAuthStateChanged(auth, (user) => {
    const loadingElement = document.getElementById('loading');
    const mainContentElement = document.getElementById('main-content');

    if (user) {
        // User is signed in
        console.log('User is signed in');

        // User accessing sign in page while signed in
        if (window.location.pathname === '/sign-in.html' && !isSigningIn) {
            
            signOut(auth).then(() => {
                console.log('User signed out successfully');
                window.location.href = '/sign-in.html'; // After signing out, redirect to the sign-in page
            }).catch((error) => {
                console.error('Error signing out:', error);
            });

        } else {
    
            if (loadingElement && mainContentElement) {
                loadingElement.style.display = 'none';
                mainContentElement.style.display = 'block';
            }
        }
    } else {
        // No user is signed in
        console.log('No user is signed in');

        // User is trying to access restricted pages
        if (window.location.pathname === '/journal.html' || window.location.pathname === '/log.html' || window.location.pathname === '/setting.html') {
            window.location.href = '/sign-in.html';
        } else {
            
            if (loadingElement && mainContentElement) {
                loadingElement.style.display = 'none';
                mainContentElement.style.display = 'block';
            }
        }
    }

    // Reset the signing in bool
    isSigningIn = false;
});

export { auth, db };