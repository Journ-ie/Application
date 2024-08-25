import { auth, db } from './init.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';

// create posts dynamically
function createPostElement(postData) {
    const postsContainer = document.querySelector('.post-reel .divide'); 

    const postItem = document.createElement('div');
    postItem.classList.add('post-items'); 

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
    editButton.setAttribute('data-key', 'edit'); 
    
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('data-key', 'delete'); 

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

    // CSS defers based on number of medias
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

    // adding the post items to the posts container
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
        createPostElement(postData);
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
