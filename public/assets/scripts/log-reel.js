import { auth, db } from './init.js';
import { collection, getDocs, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';

function createPostElement(postData, postId) {
    const postsContainer = document.querySelector('.post-reel .divide');

    const postItem = document.createElement('div');
    postItem.classList.add('post-items');
    postItem.dataset.postId = postId; 

    const postTopbar = document.createElement('div');
    postTopbar.classList.add('post-topbar');

    const postTitle = document.createElement('div');
    postTitle.classList.add('post-title');

    const postTitleText = document.createElement('h2');
    postTitleText.textContent = postData.title || 'Untitled';

    const postDate = document.createElement('span');
    postDate.classList.add('post-date');
    postDate.textContent = postData.createdAt.toDate().toLocaleDateString();

    postTitle.appendChild(postTitleText);
    postTitle.appendChild(postDate);

    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');

    const dropdownToggle = document.createElement('button');
    dropdownToggle.classList.add('dropbtn');
    dropdownToggle.innerHTML = '<i class="fa-solid fa-ellipsis-vertical"></i>';

    // Prevent page refresh or any other default behavior
    dropdownToggle.addEventListener('click', (event) => {
        event.preventDefault();  // Prevent the default action
        event.stopPropagation(); // Stop the event from bubbling up
    });

    // Ensure the dropdown content is appended after the toggle button
    dropdown.appendChild(dropdownToggle);

    const dropdownContent = document.createElement('div');
    dropdownContent.classList.add('dropdown-content');

    const editButton = document.createElement('button');
    editButton.classList.add('edit');
    editButton.textContent = 'Edit';
    editButton.setAttribute('data-key', 'edit'); 
    editButton.type = 'button';

    editButton.addEventListener('click', () => {
        const postId = postItem.dataset.postId; 
        window.location.href = `log.html?postId=${postId}`;
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('data-key', 'delete'); 
    deleteButton.type = 'button';

    deleteButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const confirmDelete = confirm("Are you sure you want to delete this post?");

        if (confirmDelete) {
            try {
                const postDocRef = doc(db, 'users', auth.currentUser.uid, 'logs', postId);
                await deleteDoc(postDocRef);
            
                postItem.remove();

                showToast("Post deleted successfully.");
            } catch (error) {
                console.error("Error deleting post:", error);
                showToast("Failed to delete post.", "error");
            }
        }
    });

    dropdownContent.appendChild(editButton);
    dropdownContent.appendChild(deleteButton);

    document.body.appendChild(dropdownContent);

    const currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    fetch(`assets/locales/${currentLanguage}.json`)
        .then(response => response.json())
        .then(data => {
            editButton.textContent = data['edit'];
            deleteButton.textContent = data['delete'];
        });
    

    dropdown.appendChild(dropdownToggle);
    dropdown.appendChild(dropdownContent);

    postTopbar.appendChild(postTitle);
    postTopbar.appendChild(dropdown);

    const postCaption = document.createElement('div');
    postCaption.classList.add('post-caption');
    postCaption.textContent = postData.message;

    const postMedia = document.createElement('div');
    postMedia.classList.add('post-media');

    const mediaUrls = Array.isArray(postData.media) ? postData.media : [postData.media];

    if (mediaUrls.length === 1) {
        postMedia.classList.add('one-image');
    } else if (mediaUrls.length === 2) {
        postMedia.classList.add('two-images');
    } else if (mediaUrls.length >= 3) {
        postMedia.classList.add('three-or-more-images');
    }

    // clear any existing content in postMedia to avoid duplicates
    
    postMedia.innerHTML = '';

    mediaUrls.slice(0, 2).forEach((url) => {
        let mediaElement;

        // check for video extensions in the entire URL
        
        const lowercasedUrl = url.toLowerCase();
        if (lowercasedUrl.includes('.mp4') || lowercasedUrl.includes('.webm') || lowercasedUrl.includes('.avi')) {
            mediaElement = document.createElement('video');
            mediaElement.src = url;
            mediaElement.controls = true;
        } else {
            mediaElement = document.createElement('img');
            mediaElement.src = url;
            mediaElement.alt = "media";
        }

        mediaElement.classList.add('media-preview-img');
        postMedia.appendChild(mediaElement);
    });

    if (mediaUrls.length > 2) {
        const seeMoreElement = document.createElement('a');
        seeMoreElement.href = "#";
        seeMoreElement.classList.add('see-more');

        const seeMoreText = document.createElement('span');
        seeMoreText.textContent = `See More`;

        seeMoreElement.style.backgroundImage = `url(${mediaUrls[2]})`;

        seeMoreElement.appendChild(seeMoreText);
        postMedia.appendChild(seeMoreElement);

        seeMoreElement.addEventListener('click', function(event) {
            event.preventDefault();
            openMediaViewer(mediaUrls, 2);
        });
    }

    const postLabels = document.createElement('div');
    postLabels.classList.add('post-labels');
    postLabels.textContent = postData.labels.join(' ');

    postItem.appendChild(postTopbar);
    postItem.appendChild(postCaption);
    postItem.appendChild(postMedia);
    postItem.appendChild(postLabels);

    postsContainer.appendChild(postItem);
}

async function fetchPosts(user) {
    const postsContainer = document.querySelector('.post-reel .divide');
    const noLogsMessage = document.getElementById('no-logs');

    const postsCollection = collection(db, 'users', user.uid, 'logs');
    const postDocs = await getDocs(postsCollection);

    if (postDocs.empty) {
        console.log('No logs found for this user.');

        noLogsMessage.style.display = 'block';
        return;
    }

    postDocs.forEach(doc => {
        const postData = doc.data();
        createPostElement(postData, doc.id);
    });

    noLogsMessage.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            await fetchPosts(user);
        } else {
            window.location.href = 'sign-in.html';
        }
    });
});

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    const videoElements = document.querySelectorAll('.post-media video');
    videoElements.forEach(video => {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
           
            video.style.objectFit = 'contain';
        } else {
            
            video.style.objectFit = 'cover';
        }
    });
}

function openMediaViewer(mediaUrls, startIndex) {
    const viewer = document.getElementById('media-viewer');
    const viewerImg = document.getElementById('media-viewer-img');
    const viewerVideo = document.getElementById('media-viewer-video');
    let currentMediaIndex = startIndex;

    function displayMedia(index) {
        viewerVideo.pause();
    
        const mediaUrl = mediaUrls[index];
        const lowercasedUrl = mediaUrl.toLowerCase();
    
        if (lowercasedUrl.includes('.mp4') || lowercasedUrl.includes('.webm') || lowercasedUrl.includes('.avi')) {
            viewerVideo.style.display = "block";
            viewerImg.style.display = "none";
    
            viewerVideo.src = mediaUrl;
        } else {
            viewerImg.src = mediaUrl;
            viewerImg.style.display = "block";
            viewerVideo.style.display = "none";
    
            viewerVideo.src = '';
        }
    }
    
    function showNext() {
        currentMediaIndex = (currentMediaIndex + 1) % mediaUrls.length;
        displayMedia(currentMediaIndex);
    }
    
    function showPrev() {
        currentMediaIndex = (currentMediaIndex - 1 + mediaUrls.length) % mediaUrls.length;
        displayMedia(currentMediaIndex);
    }

    viewer.addEventListener('click', (event) => {
        let mediaElement;
    
        if (viewerImg.style.display === "block") {
            mediaElement = viewerImg;
        } else if (viewerVideo.style.display === "block") {
            mediaElement = viewerVideo;
        }
    
        if (mediaElement) {
            const rect = mediaElement.getBoundingClientRect();
            const clickX = event.clientX - rect.left;

            console.log(rect);
    
            if (clickX < rect.width / 3) {
                showPrev(); 
            } else if (clickX > (rect.width * 2) / 3) {
                showNext(); 
            }
        }
    });
    

    displayMedia(currentMediaIndex);
    viewer.style.display = 'flex'; 

    document.querySelector('.close').onclick = function() {
        viewer.style.display = 'none';
        viewerImg.src = '';
        viewerVideo.src = '';
    };

    viewer.addEventListener('click', (event) => {
        const clickedElement = event.target;

        if (clickedElement === viewer || clickedElement === document.querySelector('.close')) {
            viewer.style.display = 'none';
            viewerImg.src = '';
            viewerVideo.src = '';
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            viewer.style.display = 'none';
            viewerImg.src = '';
            viewerVideo.src = '';
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
