// Video player functionality
export class VideoPlayer {
  constructor() {
    this.currentVideo = null;
    this.videoList = [];
    this.setupVideoPlayer();
    this.loadVideoList();
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

    // Setup video progress tracking
    const videoPlayer = document.getElementById('video-player');
    if (videoPlayer) {
      videoPlayer.addEventListener('timeupdate', () => {
        this.updateVideoProgress();
      });

      videoPlayer.addEventListener('loadedmetadata', () => {
        this.updateVideoProgress();
      });
    }
  }

  updateVideoProgress() {
    const videoPlayer = document.getElementById('video-player');
    const progressBar = document.getElementById('video-progress-bar');
    const currentTimeEl = document.getElementById('video-current-time');
    const durationEl = document.getElementById('video-duration');
    
    if (videoPlayer && progressBar) {
      const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
      progressBar.style.width = `${progress || 0}%`;
    }
    
    if (currentTimeEl && videoPlayer.currentTime) {
      currentTimeEl.textContent = this.formatTime(videoPlayer.currentTime);
    }
    
    if (durationEl && videoPlayer.duration) {
      durationEl.textContent = this.formatTime(videoPlayer.duration);
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  seekVideo(percentage) {
    const videoPlayer = document.getElementById('video-player');
    if (videoPlayer && videoPlayer.duration) {
      videoPlayer.currentTime = (percentage / 100) * videoPlayer.duration;
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

  addVideoToList(video) {
    const newId = Math.max(...this.videoList.map(v => v.id), 0) + 1;
    const newVideo = { ...video, id: newId };
    this.videoList.push(newVideo);
    this.saveVideoList();
    return newVideo;
  }

  removeVideoFromList(id) {
    this.videoList = this.videoList.filter(v => v.id !== id);
    this.saveVideoList();
  }

  saveVideoList() {
    localStorage.setItem('videoPlayerData', JSON.stringify(this.videoList));
  }

  loadVideoList() {
    const saved = localStorage.getItem('videoPlayerData');
    if (saved) {
      this.videoList = JSON.parse(saved);
      this.renderVideoList();
    }
  }

  renderVideoList() {
    const videoListEl = document.getElementById('video-list');
    if (!videoListEl) return;

    videoListEl.innerHTML = this.videoList.map(video => `
      <div class="video-item">
        <div class="video-info">
          <span class="video-title">${video.title}</span>
          <span class="video-type">${video.type === 'url' ? 'URL' : 'File'}</span>
        </div>
        <div class="video-controls">
          <button class="play-video-btn" onclick="playVideo('${video.src}', '${video.title}')">Play</button>
          <button class="delete-video-btn" onclick="deleteVideo(${video.id})">Delete</button>
        </div>
      </div>
    `).join('');
  }
}

// Global functions for HTML onclick handlers
window.playVideo = (src, title) => {
  if (window.videoPlayerInstance) {
    window.videoPlayerInstance.playVideo(src, title);
  }
};

window.deleteVideo = (id) => {
  if (window.videoPlayerInstance) {
    window.videoPlayerInstance.removeVideoFromList(id);
    window.videoPlayerInstance.renderVideoList();
  }
};