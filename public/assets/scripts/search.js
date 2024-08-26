import { auth, db } from './init.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { createPostElement } from './log-reel.js';

async function searchPosts(user, searchTerm, selectedTags) {
    const postsCollection = collection(db, 'users', user.uid, 'logs');
    let postsQuery = postsCollection;

    if (searchTerm) {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        postsQuery = query(postsCollection, where('titleKeywords', 'array-contains', lowercasedSearchTerm));
    }

    if (selectedTags.length > 0) {
        postsQuery = query(postsCollection, where('labels', 'array-contains-any', selectedTags));
    }

    const postDocs = await getDocs(postsQuery);

    if (postDocs.empty) {
        console.log('No matching logs found.');
        return [];
    }

    return postDocs.docs.map(doc => ({ id: doc.id, data: doc.data() }));
}


document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.search-button').addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user) return;

        const searchTerm = document.querySelector('.search-input').value.trim();
        const selectedTags = Array.from(document.querySelectorAll('.filter-option input:checked')).map(input => input.value);

        const posts = await searchPosts(user, searchTerm, selectedTags);
        displayPosts(posts);
    });
});

function displayPosts(posts) {
    const postsContainer = document.querySelector('.post-reel .divide');
    postsContainer.innerHTML = ''; 

    posts.forEach(post => createPostElement(post.data, post.id));
}

export { searchPosts, displayPosts };
