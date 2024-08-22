const posts = [
    {
        date: "2024-08-10",
        caption: "A thrilling journey through the highlands, where nature and adventure meet. A thrilling journey through the highlands, where nature and adventure meet. A thrilling journey through the highlands, where nature and adventure meet.",
        media: [
            "https://via.placeholder.com/400x200?text=Mountain+View+1",
            "https://via.placeholder.com/400x200?text=Mountain+View+2",
            "../assets/imgs/logo.png",
            "https://via.placeholder.com/400x200?text=Mountain+View+2",
            "https://via.placeholder.com/400x200?text=Mountain+View+3"
        ],
        labels: ["#adventure", "#nature", "#travel"]
    },
    {
        title: "City Lights at Night",
        date: "2024-08-12",
        caption: "The city never sleeps, and neither does the beauty of its lights.",
        media: [
            "https://via.placeholder.com/400x200?text=Mountain+View+1",
            "https://via.placeholder.com/400x200?text=Mountain+View+2",
  
        ],
        labels: ["#citylife", "#nightphotography", "#urban"]
    },
    {
        title: "Gourmet Delights",
        date: "2024-08-15",
        caption: "A dive into the world of gourmet cuisine, where flavors come alive.",
        media: "https://via.placeholder.com/400x200?text=Gourmet+Food",
        labels: ["#foodie", "#gourmet", "#culinary"]
    },
    {
        title: "Beach Vibes",
        date: "2024-08-18",
        caption: "Soaking up the sun and enjoying the cool breeze by the ocean.",
        media: "https://via.placeholder.com/400x200?text=Beach+Vibes",
        labels: ["#beach", "#summer", "#vacation"]
    },
    {
        title: "Tech Innovations 2024",
        date: "2024-08-20",
        caption: "A glimpse into the future with the latest tech trends and innovations.",
        media: "https://via.placeholder.com/400x200?text=Tech+2024",
        labels: ["#technology", "#innovation", "#future"]
    },
    {
        title: "Art in the Park",
        date: "2024-08-22",
        caption: "An open-air gallery where artists showcase their creativity.",
        media: "https://via.placeholder.com/400x200?text=Art+Exhibition",
        labels: ["#art", "#exhibition", "#creativity"]
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.querySelector('.post-reel .divide'); /*adding the posts in .post-reel .divide*/

    // add posts dynamically
    function createPostElement(postData) {
        // create elements for posts
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
        postDate.textContent = postData.date;

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

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.textContent = 'Delete';

        dropdownContent.appendChild(editButton);
        dropdownContent.appendChild(deleteButton);

        dropdown.appendChild(dropdownToggle);
        dropdown.appendChild(dropdownContent);

        postTopbar.appendChild(postTitle);
        postTopbar.appendChild(dropdown);

        const postCaption = document.createElement('div');
        postCaption.classList.add('post-caption');
        postCaption.textContent = postData.caption;

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

    // looping through posts array and create each post element dynamically
    posts.forEach(post => {
        createPostElement(post);
    });
});
