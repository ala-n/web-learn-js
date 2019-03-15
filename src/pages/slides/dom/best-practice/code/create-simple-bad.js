function buildPost(post) {
    const postEl = document.createElement('div');
    postEl.classList.add('post');

    const postImgEl = document.createElement('img');
    postImgEl.classList.add('post-img');
    postImgEl.src = post.imageUrl;

    const postCommentEl = document.createElement('p');
    postCommentEl.textContent = post.text;
    postCommentEl.classList.add('post-text');

    const postToolsEl = document.createElement('div');
    postImgEl.classList.add('post-tools');
    const postBtnEl = document.createElement('button');
    postBtnEl.classList.add('btn');
    postBtnEl.classList.add('btn-red');
    postToolsEl.appendChild(postBtnEl);
    // ...
    postEl.appendChild(postImgEl);
    postEl.appendChuld(postCommentEl);
    postEl.appendChuld(postToolsEl);
    return postEl;
}
