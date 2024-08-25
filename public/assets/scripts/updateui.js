import { auth, db } from './init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

document.addEventListener('readystatechange', () => {
    const profilePicture = document.getElementById('profile-picture');
    const signInButton = document.getElementById('sign-in-button');
    const profileMenu = document.getElementsByClassName('profile-menu')[0];
    const usernameText = document.getElementById('user-name');

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists() && usernameText) { 
                usernameText.innerHTML = userDoc.data().username;
                usernameText.style.display = 'block';
            }
            

            // User is signed in, show profile picture
            if (profilePicture) { 
                if (userDoc.data().profilePictureUrl) profilePicture.src = userDoc.data().profilePictureUrl;

                profilePicture.style.display = 'block';
            }

            // Show the profile menu
            if (profileMenu) profileMenu.style.display = 'block';

        } else {

            if (signInButton) signInButton.style.display = 'inline-block';
        }
    });
});
