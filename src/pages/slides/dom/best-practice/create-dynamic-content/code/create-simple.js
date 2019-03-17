function initVideo(src, container) {
    const videoEl =
        document.createElement('video');
    videoEl.classList.add('video-content');
    videoEl.src = src;
    container.appendChild(videoEl);
}