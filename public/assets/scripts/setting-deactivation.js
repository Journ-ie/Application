import { auth, db } from './init.js';
import { doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { onAuthStateChanged, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';

document.addEventListener('DOMContentLoaded', function() {
    const deactivationModal = document.getElementById('deactivationModal');
    const deactivationForm = document.getElementById('deactivation-form');
    const deactivationButton = document.getElementById('deactivation-button'); 
    
    deactivationButton.addEventListener('click', (event) => { 
        event.preventDefault();
        deactivationModal.style.display = 'block';
    });

    window.addEventListener('click', function(event) {
        if (event.target === deactivationModal) {
            deactivationModal.style.display = 'none';
        }
    });

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            deactivationForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const password = document.getElementById('password-deactivate').value.trim();
                if (!password) {
                    showToast(translations['toast-enter-password-error'], 'error');
                    return;
                }

                const credential = EmailAuthProvider.credential(user.email, password);
                try {
                    await reauthenticateWithCredential(user, credential);

                    showToast(translations['toast-account-deleted'], 'error');

                    const userDocRef = doc(db, 'users', user.uid);
                    await deleteDoc(userDocRef);

                    await deleteUser(user);

                    setTimeout(() => {
                        deactivationModal.style.display = 'none';
                        window.location.href = 'sign-in.html';
                    }, 7000);

                } catch (error) {
                    console.error('Error deactivating account:', error);
                    showToast(translations['toast-incorrect-password-or-error'], 'error');
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
 