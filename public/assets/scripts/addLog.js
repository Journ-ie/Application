import { auth, db } from './init.js';
import { doc, setDoc, collection, Timestamp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';

document.querySelector('#return-submit .submit').addEventListener('click', async (event) => {
    event.preventDefault();
    
    const user = auth.currentUser;

    // getting data from log form
    const logTitle = document.querySelector('.log-title').value.trim();
    const message = document.querySelector('.message').value.trim();
    const selectedLabels = Array.from(document.querySelectorAll('#label-options input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

    if (!logTitle || !message) {
        showToast('Title and message cannot be empty.');
        return;
    }

    try {
        const logsCollection = collection(db, 'users', user.uid, 'logs');
        
        await setDoc(doc(logsCollection), {
            title: logTitle,
            message: message,
            labels: selectedLabels,
            createdAt: Timestamp.now()
        });

        showToast('Log submitted sucessfully!');
        // Optionally, clear the form or redirect the user
        document.querySelector('form').reset();
    } catch (error) {
        console.error('Error adding log:', error);
        showToast('Error submitting log. Please try again.');
    }
});

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
