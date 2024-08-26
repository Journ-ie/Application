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
    
        // handle existing media URLs (from the post being edited)
        existingMedia.forEach((mediaUrl, index) => {
            const mediaElement = document.createElement('div');
            mediaElement.classList.add('media-item');
    
            if (mediaUrl.includes('.mp4') || mediaUrl.includes('.webm') || mediaUrl.includes('.avi')) {
                mediaElement.innerHTML = `
                    <video src="${mediaUrl}" controls class="media-preview-img"></video>
                    <button type="button" class="remove-media" data-index="${index}">Remove</button>
                `;
            } else {
                mediaElement.innerHTML = `
                    <img src="${mediaUrl}" alt="media" class="media-preview-img">
                    <button type="button" class="remove-media" data-index="${index}">Remove</button>
                `;
            }
    
            mediaPreviewContainer.appendChild(mediaElement);
        });
    
        // handle newly added files
        newFiles.forEach((file, index) => {
            const fileReader = new FileReader();
            fileReader.onload = function(e) {
                const mediaElement = document.createElement('div');
                mediaElement.classList.add('media-item');
    
                if (file.type.startsWith('image/')) {
                    mediaElement.innerHTML = `
                        <img src="${e.target.result}" alt="media" class="media-preview-img">
                        <button type="button" class="remove-media" data-index="${existingMedia.length + index}">Remove</button>
                    `;
                } else if (file.type.startsWith('video/')) {
                    mediaElement.innerHTML = `
                        <video src="${e.target.result}" controls class="media-preview-img"></video>
                        <button type="button" class="remove-media" data-index="${existingMedia.length + index}">Remove</button>
                    `;
                }
    
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
            showToast(translations['toast-login-to-submit'], 'error');
            window.location.href = 'login.html';
            return;
        }

        const logTitle = document.querySelector('.log-title').value.trim();
        const message = document.querySelector('.message').value.trim();
        const selectedLabels = Array.from(document.querySelectorAll('#label-options input[type="checkbox"]:checked')).map(checkbox => `#${checkbox.value}`);

        if (!logTitle || !message) {
            showToast(translations['log-empty-values'], 'error');
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

            showToast(translations['toast-submit-log-success'], 'success');

            setTimeout(() => {
                window.location.href = 'journal.html';
            }, 1000);

            document.querySelector('form').reset();
            selectedFiles = [];
            mediaPreviewContainer.innerHTML = ''; 
        } catch (error) {
            console.error('Error adding log:', error);
            showToast(translations['toast-submit-log-error'], 'error');
        }
    });
});

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    const videoElements = document.querySelectorAll('.media-preview video');
    videoElements.forEach(video => {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            video.style.objectFit = 'contain';
            video.style.width = '100%';
            video.style.height = 'auto';
            video.style.borderRadius = '0';
        } else {
            video.style.objectFit = 'cover';
            video.style.width = '100%';
            video.style.height = '100px'; 
            video.style.borderRadius = '5px';
        }
    });
}

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
