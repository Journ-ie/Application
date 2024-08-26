import { auth, db } from './init.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { onAuthStateChanged, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';

document.addEventListener('DOMContentLoaded', function() {
    const passwordChangeModal = document.getElementById('passwordChangeModal');
    const passwordChangeForm = document.getElementById('password-change-form'); 

    if (!passwordChangeForm) {
        console.error('password-change-form element not found.');
        return;
    }

    const changePasswordButton = document.querySelector('.change-password');
    const closeModal = document.querySelector('.close'); 

    // open change password modal
    if (changePasswordButton) {
        changePasswordButton.addEventListener('click', (event) => {
            event.preventDefault();
            passwordChangeModal.style.display = 'block';
        });
    }
    if (closeModal) {
        closeModal.onclick = function() {
            passwordChangeModal.style.display = 'none';
        };
    }
    window.onclick = function(event) {
        if (event.target == passwordChangeModal) {
            passwordChangeModal.style.display = 'none';
        }
    };

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            passwordChangeForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const currentPassword = document.getElementById('current-password').value.trim();
                const newPassword = document.getElementById('new-password').value.trim();
                const confirmPassword = document.getElementById('confirm-password').value.trim();


                if (!currentPassword || !newPassword || !confirmPassword) {
                    showToast(translations['toast-required-fields-error'], 'error');
                    return;
                }

                if (newPassword !== confirmPassword) {
                    showToast(translations['toast-passwords-mismatch-error'], 'error');
                    return;
                }

                const credential = EmailAuthProvider.credential(user.email, currentPassword);

                try {
                    await reauthenticateWithCredential(user, credential); // authenticates user
                    await updatePassword(user, newPassword);

                    showToast(translations['toast-password-update-success'], 'success');
                    passwordChangeModal.style.display = 'none';
                } catch (error) {
                    if (error.code === 'auth/invalid-credential') {
                        showToast(translations['toast-incorrect-current-password-error'], 'error');

                    } else {
                        showToast(translations['toast-password-update-failure-error'], 'error');
                
                    }
                }
            });
        } else {
            console.error('User is not authenticated');
            window.location.href = 'sign-in.html';
        }
    });
});

// notification
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
