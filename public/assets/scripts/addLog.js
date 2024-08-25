import { auth, db } from './init.js';
import { doc, setDoc, collection, Timestamp, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js';

const storage = getStorage();

document.addEventListener('DOMContentLoaded', async () => {
    let selectedFiles = []; 
    const mediaPreviewContainer = document.getElementById('media-preview'); 
    let postData = { media: [] }; 

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('postId');

            if (postId) {
                try {
                    const postDocRef = doc(db, 'users', user.uid, 'logs', postId);
                    const postDoc = await getDoc(postDocRef);

                    if (postDoc.exists()) {
                        postData = postDoc.data(); 
                        postData.media = postData.media || []; 
                        document.querySelector('.log-title').value = postData.title || '';
                        document.querySelector('.message').value = postData.message || '';

                        const selectedLabels = postData.labels || [];
                        selectedLabels.forEach(label => {
                            const checkbox = document.querySelector(`#label-options input[value="${label.replace('#', '')}"]`);
                            if (checkbox) checkbox.checked = true;
                        });

                        renderPreview(postData.media || []);
                    } else {
                        console.error("No such document!");
                    }
                } catch (error) {
                    console.error("Error getting document:", error);
                }
            }
        } else {
            window.location.href = 'login.html';
        }
    });

    document.getElementById('add-media').addEventListener('click', function() {
        document.getElementById('media-upload').click();
    });

    document.querySelector('#media-upload').addEventListener('change', (event) => {
        const files = event.target.files;

        Array.from(files).forEach((file) => {
            selectedFiles.push(file);
        });

        renderPreview(postData.media || [], selectedFiles);
    });

    mediaPreviewContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-media')) {
            event.preventDefault(); 
            const index = parseInt(event.target.dataset.index);
            if (index < (postData.media || []).length) {
                postData.media.splice(index, 1); 
            } else {
                selectedFiles.splice(index - (postData.media || []).length, 1); 
            }
            renderPreview(postData.media || [], selectedFiles); 
        }
    });

    function renderPreview(existingMedia = [], newFiles = []) {
        mediaPreviewContainer.innerHTML = ''; 

        existingMedia.forEach((mediaUrl, index) => {
            const mediaElement = document.createElement('div');
            mediaElement.classList.add('media-item');
            mediaElement.innerHTML = `
                ${mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm') || mediaUrl.endsWith('.avi') ? 
                    `<video src="${mediaUrl}" controls class="media-preview-img"></video>` : 
                    `<img src="${mediaUrl}" alt="media" class="media-preview-img">`}
                <button type="button" class="remove-media" data-index="${index}">Remove</button>
            `;
            mediaPreviewContainer.appendChild(mediaElement);
        });

        newFiles.forEach((file, index) => {
            const fileReader = new FileReader();
            fileReader.onload = function(e) {
                const mediaElement = document.createElement('div');
                mediaElement.classList.add('media-item');
                mediaElement.innerHTML = `
                    ${file.type.startsWith('image/') ? `<img src="${e.target.result}" alt="media" class="media-preview-img">` : ''}
                    ${file.type.startsWith('video/') ? `<video src="${e.target.result}" controls class="media-preview-img"></video>` : ''}
                    <button type="button" class="remove-media" data-index="${existingMedia.length + index}">Remove</button>
                `;
                mediaPreviewContainer.appendChild(mediaElement);
            };

            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                fileReader.readAsDataURL(file);
            }
        });
    }

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
        const selectedLabels = Array.from(document.querySelectorAll('#label-options input[type="checkbox"]:checked')).map(checkbox => `#${checkbox.value}`);

        if (!logTitle || !message) {
            showToast('Title and message cannot be empty.', 'error');
            return;
        }

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('postId');
            let logRef;

            if (postId) {
                logRef = doc(db, 'users', user.uid, 'logs', postId);
            } else {
                logRef = doc(collection(db, 'users', user.uid, 'logs'));
            }

            const mediaUrls = postId && postData ? postData.media : [];

            for (const file of selectedFiles) {
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
            }, { merge: true });

            showToast('Log submitted successfully!', 'success');

            setTimeout(() => {
                window.location.href = 'journal.html';
            }, 1000);

            document.querySelector('form').reset();
            selectedFiles = [];
            mediaPreviewContainer.innerHTML = ''; 
        } catch (error) {
            console.error('Error adding log:', error);
            showToast('Error submitting log. Please try again.', 'error');
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
