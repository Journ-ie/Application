import { auth, db } from './init.js';
import { doc, setDoc, collection, Timestamp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js';

const storage = getStorage();

document.querySelector('#log-submit').addEventListener('click', async (event) => {
    event.preventDefault();

    const user = auth.currentUser;

    if (!user) {
        console.error('User is not authenticated');
        showToast('You need to be logged in to submit a log.', 'error');
        window.location.href = 'login.html';
        return;
    }

    const logTitle = document.querySelector('.log-title').value.trim();
    const message = document.querySelector('.message').value.trim();
    const selectedLabels = Array.from(document.querySelectorAll('#label-options input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

    if (!logTitle || !message) {
        showToast('Title and message cannot be empty.', 'error');
        return;
    }

    try {
        const logRef = doc(collection(db, 'users', user.uid, 'logs'));

        const mediaFiles = document.querySelector('#media-upload').files;
        const mediaUrls = [];

        for (const file of mediaFiles) {
            const storageRef = ref(storage, `users/${user.uid}/logs/${logRef.id}/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            mediaUrls.push(downloadURL);
        }

        await setDoc(logRef, {
            title: logTitle,
            message: message,
            labels: selectedLabels,
            media: mediaUrls,  
            createdAt: Timestamp.now()
        });

        showToast('Log submitted successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'journal.html';
        }, 2000);

        document.querySelector('form').reset();
    } catch (error) {
        console.error('Error adding log:', error);
        showToast('Error submitting log. Please try again.', 'error');
    }
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
