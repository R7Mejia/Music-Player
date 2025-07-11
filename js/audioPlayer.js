// Audio player functionality
export class AudioPlayer {
  constructor() {
    this.audio = new Audio();
    this.userData = {
      songs: [],
      currentSong: null,
      songCurrentTime: 0,
    };
    this.setupProgressTracking();
  }

  setupProgressTracking() {
    this.audio.addEventListener('timeupdate', () => {
      if (this.audio.duration) {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.updateProgressBar(progress);
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.updateProgressBar(0);
    });
  }

  updateProgressBar(progress) {
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    
    if (currentTimeEl && this.audio.currentTime) {
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
    const song = this.userData?.songs.find((song) => song.id === id);
    if (!song) return;

    this.audio.src = song.src;
    this.audio.title = song.title;

    if (this.userData?.currentSong === null || this.userData?.currentSong.id !== song.id) {
      this.audio.currentTime = 0;
    } else {
      this.audio.currentTime = this.userData?.songCurrentTime;
    }
    
    this.userData.currentSong = song;
    this.audio.play();
  }

  pauseSong() {
    this.userData.songCurrentTime = this.audio.currentTime;
    this.audio.pause();
  }

  playNextSong() {
    if (this.userData?.currentSong === null) {
      this.playSong(this.userData?.songs[0].id);
    } else {
      const currentSongIndex = this.getCurrentSongIndex();
      const nextSong = this.userData?.songs[currentSongIndex + 1];
      if (nextSong) {
        this.playSong(nextSong.id);
      }
    }
  }

  playPreviousSong() {
    if (this.userData?.currentSong === null) return;
    
    const currentSongIndex = this.getCurrentSongIndex();
    const previousSong = this.userData?.songs[currentSongIndex - 1];
    if (previousSong) {
      this.playSong(previousSong.id);
    }
  }

  shuffle() {
    this.userData?.songs.sort(() => Math.random() - 0.5);
    this.userData.currentSong = null;
    this.userData.songCurrentTime = 0;
    this.pauseSong();
  }

  getCurrentSongIndex() {
    return this.userData?.songs.indexOf(this.userData?.currentSong);
  }

  setSongs(songs) {
    this.userData.songs = [...songs];
    this.saveToStorage();
  }

  deleteSong(id) {
    if (this.userData?.currentSong?.id === id) {
      this.userData.currentSong = null;
      this.userData.songCurrentTime = 0;
      this.pauseSong();
    }
    this.userData.songs = this.userData?.songs.filter((song) => song.id !== id);
    this.saveToStorage();
  }

  addSong(song) {
    const newId = Math.max(...this.userData.songs.map(s => s.id), 0) + 1;
    const newSong = { ...song, id: newId };
    this.userData.songs.push(newSong);
    this.saveToStorage();
    return newSong;
  }

  saveToStorage() {
    localStorage.setItem('musicPlayerData', JSON.stringify({
      songs: this.userData.songs,
      currentSong: this.userData.currentSong,
      songCurrentTime: this.userData.songCurrentTime
    }));
  }

  loadFromStorage() {
    const saved = localStorage.getItem('musicPlayerData');
    if (saved) {
      const data = JSON.parse(saved);
      this.userData.songs = data.songs || [];
      this.userData.currentSong = data.currentSong || null;
      this.userData.songCurrentTime = data.songCurrentTime || 0;
      return true;
    }
    return false;
  }
}