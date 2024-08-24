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
        showToast('All fields are required. Please complete the form to create an account.', 'success');
        return;
    }

    if (password !== reEnterPassword) {
        showToast('Passwords do not match!', 'success');
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

        window.location.href = 'journal.html';
    } catch (error) {
        console.error('Error details:', error);
        if (error.code === 'auth/email-already-in-use') {
            showToast('This email is already registered!', 'success');
        } else {
            showToast('Error registering user', 'success');
        }
    }
});

// Sign In
document.querySelector('#sign-in-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const email = event.target.email.value.trim();  
    const password = event.target.password.value.trim();  

    if (!email || !password) {
        showToast('Please enter both email and password.', 'success');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showToast('Please enter a valid email address.', 'success');
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.location.href = 'journal.html';
        })
        .catch((error) => {
            if (error.code === 'auth/wrong-password') {
                showToast('Incorrect password. Please try again.', 'success');
            } else if (error.code === 'auth/user-not-found') {
                showToast('No user found with this email.', 'success');
            } else if (error.code === 'auth/invalid-email') {
                showToast('Invalid email address.', 'success');
            } else {
                showToast('Incorrect email or password. Please try again.', 'success');
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
