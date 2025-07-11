// Audio player functionality
import { allSongs } from './constants.js';

export class AudioPlayer {
  constructor() {
    this.audio = new Audio();
    this.userData = {
      songs: [...allSongs],
      currentSong: null,
      songCurrentTime: 0,
    };
    this.setupAudioEvents();
  }

  setupAudioEvents() {
    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.updateProgress();
    });
  }

  updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    
    if (progressBar && this.audio.duration) {
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      progressBar.style.width = `${progress}%`;
    }
    
    if (currentTimeEl) {
      currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }
    
    if (durationEl && this.audio.duration) {
      durationEl.textContent = this.formatTime(this.audio.duration);
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  seekTo(percentage) {
    if (this.audio.duration) {
      this.audio.currentTime = (percentage / 100) * this.audio.duration;
    }
  }

  playSong(id) {
    const song = this.userData.songs.find((song) => song.id === id);
    this.audio.src = song.src;
    this.audio.currentTime = this.userData.songCurrentTime || 0;
    this.userData.currentSong = song;
    this.audio.play();
    this.saveToStorage();
  }

  pauseSong() {
    this.userData.songCurrentTime = this.audio.currentTime;
    this.audio.pause();
    this.saveToStorage();
  }

  playNextSong() {
    if (this.userData.currentSong === null) {
      this.playSong(this.userData.songs[0].id);
    } else {
      const currentSongIndex = this.getCurrentSongIndex();
      const nextSong = this.userData.songs[currentSongIndex + 1];
      this.playSong(nextSong.id);
    }
  }

  playPreviousSong() {
    if (this.userData.currentSong === null) return;
    const currentSongIndex = this.getCurrentSongIndex();
    const previousSong = this.userData.songs[currentSongIndex - 1];
    this.playSong(previousSong.id);
  }

  shuffle() {
    this.userData.songs = this.userData.songs.sort(() => Math.random() - 0.5);
    this.saveToStorage();
  }

  deleteSong(id) {
    const songToDelete = this.userData.songs.find((song) => song.id === id);
    
    if (songToDelete === this.userData.currentSong) {
      this.userData.currentSong = null;
      this.userData.songCurrentTime = 0;
      this.pauseSong();
    }

    this.userData.songs = this.userData.songs.filter((song) => song.id !== id);
    this.saveToStorage();
  }

  addSong(song) {
    const newId = Math.max(...this.userData.songs.map(s => s.id), 0) + 1;
    const newSong = { ...song, id: newId };
    this.userData.songs.push(newSong);
    this.saveToStorage();
    return newSong;
  }

  setSongs(songs) {
    this.userData.songs = songs;
    this.saveToStorage();
  }

  getCurrentSongIndex() {
    return this.userData.songs.indexOf(this.userData.currentSong);
  }

  saveToStorage() {
    const storageKey = `musicPlayerData_${this.getUserId()}`;
    localStorage.setItem(storageKey, JSON.stringify(this.userData));
  }

  loadFromStorage() {
    const storageKey = `musicPlayerData_${this.getUserId()}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      this.userData = JSON.parse(saved);
      return true;
    }
    return false;
  }

  getUserId() {
    // Generate or retrieve unique user ID for privacy
    let userId = localStorage.getItem('musicPlayerUserId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('musicPlayerUserId', userId);
    }
    return userId;
  }
}