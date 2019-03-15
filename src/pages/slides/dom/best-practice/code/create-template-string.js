function buildPost(post) {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
    postEl.innerHTML = `
      <img src="${post.imageUrl}" class="post-img"/>
      <p class="post-text">${post.text}</p>
      <div class="post-tools">
          <button class="btn btn-red">Delete</button>
      </div>
    `;
    return postEl;
}