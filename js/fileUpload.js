// File upload functionality
export class FileUploadManager {
  constructor(audioPlayer, uiManager) {
    this.audioPlayer = audioPlayer;
    this.uiManager = uiManager;
    this.setupFileUpload();
  }

  setupFileUpload() {
    const musicFileInput = document.getElementById('music-file-input');
    const videoFileInput = document.getElementById('video-file-input');
    const videoUrlInput = document.getElementById('video-url-input');
    const addVideoUrlBtn = document.getElementById('add-video-url-btn');

    if (musicFileInput) {
      musicFileInput.addEventListener('change', (e) => this.handleMusicUpload(e));
    }

    if (videoFileInput) {
      videoFileInput.addEventListener('change', (e) => this.handleVideoUpload(e));
    }

    if (addVideoUrlBtn) {
      addVideoUrlBtn.addEventListener('click', () => this.handleVideoUrl());
    }
  }

  handleMusicUpload(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        const song = {
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Unknown Artist",
          duration: "0:00",
          src: url,
          isUserUploaded: true
        };

        // Get duration using audio element
        const tempAudio = new Audio(url);
        tempAudio.addEventListener('loadedmetadata', () => {
          const minutes = Math.floor(tempAudio.duration / 60);
          const seconds = Math.floor(tempAudio.duration % 60);
          song.duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          
          const addedSong = this.audioPlayer.addSong(song);
          this.uiManager.renderSongs(this.audioPlayer.userData.songs);
          this.showNotification(`Added: ${song.title}`);
        });
      }
    });
  }

  handleVideoUpload(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        this.addVideoToPlaylist({
          title: file.name.replace(/\.[^/.]+$/, ""),
          src: url,
          type: 'file'
        });
      }
    });
  }

  handleVideoUrl() {
    const urlInput = document.getElementById('video-url-input');
    const url = urlInput.value.trim();
    
    if (url) {
      // Extract title from URL or use URL as title
      let title = url;
      try {
        const urlObj = new URL(url);
        title = urlObj.pathname.split('/').pop() || urlObj.hostname;
      } catch (e) {
        title = url;
      }

      this.addVideoToPlaylist({
        title: title,
        src: url,
        type: 'url'
      });
      
      urlInput.value = '';
    }
  }

  addVideoToPlaylist(video) {
    if (window.videoPlayerInstance) {
      window.videoPlayerInstance.addVideoToList(video);
      window.videoPlayerInstance.renderVideoList();
    }
    this.showNotification(`Added video: ${video.title}`);
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}