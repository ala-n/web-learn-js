posts.forEach((post) => {
    document.querySelector('.posts-container')
        .appendChild(buildPost(post));
});