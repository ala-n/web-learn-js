const containerEl = document.querySelector('.posts-container');
posts.forEach((post) => {
    containerEl.appendChild(buildPost(post));
});