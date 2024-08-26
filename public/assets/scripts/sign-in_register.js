import { auth, db } from './init.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { collection, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

// Register
document.querySelector('#register-form form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = event.target.querySelector('.username').value.trim();
    const firstName = event.target['first-name'].value.trim();
    const lastName = event.target['last-name'].value.trim();
    const dob = event.target.dob.value.trim();
    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();
    const reEnterPassword = event.target['re-enter-password'].value.trim();

    if (!username || !firstName || !lastName || !dob || !email || !password || !reEnterPassword) {
        showToast(translations['toast-all-fields-required-create-account-error'], 'error');
        return;
    }

    if (password !== reEnterPassword) {
        showToast(translations['toast-passwords-mismatch-error'], 'error');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const usersCollection = collection(db, 'users'); 
        const userDoc = doc(usersCollection, user.uid); 

        await setDoc(userDoc, {
            username: username,
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            email: user.email
        });

        showToast(translations['toast-account-created-success'], 'success');

        setTimeout(() => {
            window.location.href = 'journal.html';
        }, 1000);

    } catch (error) {
        console.error('Error details:', error);
        if (error.code === 'auth/email-already-in-use') {
            showToast(translations['toast-email-already-registered-error'], 'error');
        } else {
            showToast(translations['toast-error-registering-user-error'], 'error');
        }
    }
});

// Sign In
document.querySelector('#sign-in-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const email = event.target.email.value.trim();  
    const password = event.target.password.value.trim();  

    if (!email || !password) {
        showToast(translations['toast-enter-email-password-error'], 'error');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showToast(translations['toast-invalid-email-error'], 'error');
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.location.href = 'journal.html';
        })
        .catch((error) => {
            if (error.code === 'auth/wrong-password') {
                showToast(translations['toast-incorrect-password-error'], 'error');
            } else if (error.code === 'auth/user-not-found') {
                showToast(translations['toast-no-user-found-error'], 'error');
            } else if (error.code === 'auth/invalid-email') {
                showToast(translations['toast-invalid-email-address-error'], 'error');
            } else {
                showToast(translations['toast-incorrect-email-password-error'], 'error');
            }
        });
});

// Switch Forms
document.addEventListener("DOMContentLoaded", function() {
    const signInForm = document.getElementById("sign-in-form");
    const registerForm = document.getElementById("register-form");

    document.getElementById("create-account-btn").addEventListener("click", function() {
        signInForm.style.display = "none";
        registerForm.style.display = "block";
    });

    document.getElementById("already-have-account-btn").addEventListener("click", function() {
        registerForm.style.display = "none";
        signInForm.style.display = "block";
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

