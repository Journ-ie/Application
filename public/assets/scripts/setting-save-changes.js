import { auth, db } from './init.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { onAuthStateChanged, reauthenticateWithCredential, EmailAuthProvider } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js';

const storage = getStorage();

document.addEventListener('DOMContentLoaded', function() {
    const passwordModal = document.getElementById('passwordModal');
    const passwordForm = document.getElementById('password-confirmation-form');
    const saveInfoButton = document.getElementById('save-info');
    const closeModal = document.querySelector('.close');

    const profilePictureUpload = document.getElementById('profile-picture-upload');
    const profilePicturePreview = document.getElementById('profile-picture-preview');
    let profilePictureFile; 
    let userData = {};

    // open the confirm changes modal
    saveInfoButton.addEventListener('click', (event) => {
        event.preventDefault();
        passwordModal.style.display = 'block';
    });

    window.addEventListener('click', function(event) {
        if (event.target === passwordModal) {
            passwordModal.style.display = 'none';
        }
    });

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            // takes all data from db and adds as placeholder on user info
            if (userDoc.exists()) {
                userData = userDoc.data();
                document.getElementById('first-name').value = userData.firstName || '';
                document.getElementById('last-name').value = userData.lastName || '';
                document.getElementById('dob').value = userData.dob || '';
                document.querySelector('.username').value = userData.username || '';
                document.getElementById('email').value = user.email || '';

                // set the users profile picture if exists
                if (userData.profilePictureUrl) {
                    profilePicturePreview.src = userData.profilePictureUrl;
                }

            } else {
                console.error('No user data found!');
            }

            // handle a profile picture file being selected
            profilePictureUpload.addEventListener('change', (event) => {
                profilePictureFile = event.target.files[0];

                if (profilePictureFile) {
                    const reader = new FileReader();

                    reader.onload = (e) => {
                        profilePicturePreview.src = e.target.result;
                    };

                    reader.readAsDataURL(profilePictureFile);
                }
            });

            // confirmation form submission
            passwordForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const password = document.getElementById('password').value.trim();
                if (!password) {
                    showToast('Please enter your password.', 'error');
                    return;
                }

                const credential = EmailAuthProvider.credential(user.email, password);
                try {
                    await reauthenticateWithCredential(user, credential);

                    // updating user info
                    const updatedFirstName = document.getElementById('first-name').value.trim();
                    const updatedLastName = document.getElementById('last-name').value.trim();
                    const updatedDob = document.getElementById('dob').value;
                    const updatedUsername = document.querySelector('.username').value.trim();
                    const updatedEmail = document.getElementById('email').value.trim();

                    if (!updatedFirstName || !updatedLastName || !updatedDob || !updatedUsername || !updatedEmail) {
                        showToast('All fields are required. Please complete the form.', 'error');
                        return;
                    }

                    let profilePictureUrl = userData.profilePictureUrl;

                    // upload the new profile picture if one is selected
                    if (profilePictureFile) {
                        const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);

                        await uploadBytes(storageRef, profilePictureFile);

                        profilePictureUrl = await getDownloadURL(storageRef);
                    }

                    await updateDoc(userDocRef, {
                        firstName: updatedFirstName,
                        lastName: updatedLastName,
                        dob: updatedDob,
                        username: updatedUsername,
                        email: updatedEmail,
                        profilePictureUrl: profilePictureUrl
                    });

                    if (user.email !== updatedEmail) {
                        await user.updateEmail(updatedEmail);
                    }

                    showToast('Profile updated successfully!', 'success');
                    passwordModal.style.display = 'none'; // Close the modal
                } catch (error) {
                    console.error('Error updating user data:', error);
                    showToast('Incorrect password. Please try again.', 'error');
                }
            });
        } else {
            console.error('User is not authenticated');
            window.location.href = 'sign-in.html';
        }
    });
});

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;

    toast.classList.remove('toast-success', 'toast-error');

    if (type === 'error') {
        toast.classList.add('toast-error');
    } else {
        toast.classList.add('toast-success');
    }

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
