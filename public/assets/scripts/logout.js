import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { auth } from "./init.js";

document.getElementById('logout-link').addEventListener('click', function(event) {
    event.preventDefault();  

    signOut(auth).then(() => {
        window.location.href = '/sign-in.html';

    }).catch((error) => {

        console.error('Error signing out:', error);
    });
});