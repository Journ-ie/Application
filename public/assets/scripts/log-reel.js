import { auth, db } from './init.js';
import { collection, getDocs, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';

function createPostElement(postData, postId) {
    const postsContainer = document.querySelector('.post-reel .divide');

    const postItem = document.createElement('div');
    postItem.classList.add('post-items');
    postItem.dataset.postId = postId; // Store the post ID in the element

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

    const dropdownContent = document.createElement('div');
    dropdownContent.classList.add('dropdown-content');

    const editButton = document.createElement('button');
    editButton.classList.add('edit');
    editButton.textContent = 'Edit';
    editButton.type = 'button';

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.textContent = 'Delete';
    deleteButton.type = 'button';

    deleteButton.addEventListener('click', async () => {
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

    mediaUrls.slice(0, 2).forEach((url) => {
        const mediaImg = document.createElement('img');
        mediaImg.src = url;
        postMedia.appendChild(mediaImg);
    });

    if (mediaUrls.length > 3) {
        const seeMoreElement = document.createElement('a');
        seeMoreElement.href = "#";
        seeMoreElement.classList.add('see-more');

        const seeMoreText = document.createElement('span');
        seeMoreText.textContent = `See More (${mediaUrls.length - 3})`;

        seeMoreElement.style.backgroundImage = `url(${mediaUrls[2]})`;

        seeMoreElement.appendChild(seeMoreText);
        postMedia.appendChild(seeMoreElement);
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

// fetching posts from db
async function fetchPosts(user) {
    const postsContainer = document.querySelector('.post-reel .divide');
    const noLogsMessage = document.getElementById('no-logs-message');

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
