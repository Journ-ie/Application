import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { auth } from "./init.js";

// Attach the event listener to the logout link
document.getElementById('logout-link').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent the default link navigation

    signOut(auth).then(() => {
        // Sign-out successful, redirect to the sign-in page
        window.location.href = '/sign-in.html';
    }).catch((error) => {
        // Handle errors here
        console.error('Error signing out:', error);
    });
});