// Main application entry point
import { allSongs } from './constants.js';
import { AudioPlayer } from './audioPlayer.js';
import { UIManager } from './uiManager.js';
import { FileUploadManager } from './fileUpload.js';
import { VideoPlayer } from './videoPlayer.js';

class MusicPlayerApp {
  constructor() {
    this.audioPlayer = new AudioPlayer();
    this.uiManager = new UIManager(this.audioPlayer);
    this.fileUploadManager = new FileUploadManager(this.audioPlayer, this.uiManager);
    this.videoPlayer = new VideoPlayer();
    
    this.init();
  }

  init() {
    // Set initial songs and sort alphabetically
    const sortedSongs = [...allSongs].sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });

    this.audioPlayer.setSongs(sortedSongs);
    this.uiManager.renderSongs(sortedSongs);
    this.uiManager.updatePlayerDisplay();

    // Make instances available globally for HTML onclick handlers
    window.audioPlayerInstance = this.audioPlayer;
    window.uiManagerInstance = this.uiManager;
    window.videoPlayerInstance = this.videoPlayer;

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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MusicPlayerApp();
});