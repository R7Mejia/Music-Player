// Video player functionality
export class VideoPlayer {
  constructor() {
    this.currentVideo = null;
    this.setupVideoPlayer();
  }

  setupVideoPlayer() {
    const videoModal = document.getElementById('video-modal');
    const closeVideoBtn = document.getElementById('close-video-btn');
    
    if (closeVideoBtn) {
      closeVideoBtn.addEventListener('click', () => this.closeVideo());
    }

    // Close modal when clicking outside
    if (videoModal) {
      videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
          this.closeVideo();
        }
      });
    }
  }

  playVideo(src, title) {
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('video-player');
    const videoTitle = document.getElementById('video-title');
    
    if (videoPlayer && videoModal) {
      videoPlayer.src = src;
      videoTitle.textContent = title;
      videoModal.style.display = 'flex';
      this.currentVideo = { src, title };
    }
  }

  closeVideo() {
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('video-player');
    
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.src = '';
    }
    
    if (videoModal) {
      videoModal.style.display = 'none';
    }
    
    this.currentVideo = null;
  }
}

// Global functions for HTML onclick handlers
window.playVideo = (src, title) => {
  if (window.videoPlayerInstance) {
    window.videoPlayerInstance.playVideo(src, title);
  }
};

window.deleteVideo = (button) => {
  const videoItem = button.closest('.video-item');
  if (videoItem) {
    videoItem.remove();
  }
};