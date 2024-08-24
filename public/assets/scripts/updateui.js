import { auth } from './init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';

document.addEventListener('readystatechange', () => {
    const profilePicture = document.getElementById('profile-picture');
    const signInButton = document.getElementById('sign-in-button');
    const profileMenu = document.getElementsByClassName('profile-menu');

    onAuthStateChanged(auth, (user) => {
        if (user) {

            // User is signed in, show profile picture
            profilePicture.style.display = 'block';

            // Set picture to user picture here

            // Show the profile menu
            profileMenu[0].style.display = 'block';

        } else {
            // User is not signed in, show sign in
            signInButton.style.display = 'inline-block';
        }
    });
});
