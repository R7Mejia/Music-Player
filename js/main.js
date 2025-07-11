// Main application entry point
import { allSongs } from './constants.js';
import { AudioPlayer } from './audioPlayer.js';
import { UIManager } from './uiManager.js';
import { FileUploadManager } from './fileUpload.js';
import { VideoPlayer } from './videoPlayer.js';
import { BackgroundManager } from './backgroundManager.js';

class MusicPlayerApp {
  constructor() {
    this.audioPlayer = new AudioPlayer();
    this.uiManager = new UIManager(this.audioPlayer);
    this.fileUploadManager = new FileUploadManager(this.audioPlayer, this.uiManager);
    this.videoPlayer = new VideoPlayer();
    this.backgroundManager = new BackgroundManager();
    
    this.init();
  }

  init() {
    // Load saved data or use default songs
    const hasStoredData = this.audioPlayer.loadFromStorage();
    
    if (!hasStoredData) {
      // Set initial songs and sort alphabetically
      const sortedSongs = [...allSongs].sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });
      this.audioPlayer.setSongs(sortedSongs);
    }

    this.uiManager.renderSongs(this.audioPlayer.userData.songs);
    this.uiManager.updatePlayerDisplay();
    this.setupProgressControls();

    // Make instances available globally for HTML onclick handlers
    window.audioPlayerInstance = this.audioPlayer;
    window.uiManagerInstance = this.uiManager;
    window.videoPlayerInstance = this.videoPlayer;
    window.backgroundManager = this.backgroundManager;

    // Global functions for HTML onclick handlers
    window.playSong = (id) => {
      this.audioPlayer.playSong(id);
      this.uiManager.updatePlayerDisplay();
    };

    window.deleteSong = (id) => {
      this.audioPlayer.deleteSong(id);
      this.uiManager.renderSongs(this.audioPlayer.userData.songs);
      this.uiManager.updatePlayerDisplay();
    };

    console.log('Music Player App initialized');
  }

  setupProgressControls() {
    // Audio progress bar click handler
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) {
      progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const percentage = ((e.clientX - rect.left) / rect.width) * 100;
        this.audioPlayer.seekTo(percentage);
      });
    }

    // Video progress bar click handler
    const videoProgressContainer = document.getElementById('video-progress-container');
    if (videoProgressContainer) {
      videoProgressContainer.addEventListener('click', (e) => {
        const rect = videoProgressContainer.getBoundingClientRect();
        const percentage = ((e.clientX - rect.left) / rect.width) * 100;
        this.videoPlayer.seekVideo(percentage);
      });
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MusicPlayerApp();
});