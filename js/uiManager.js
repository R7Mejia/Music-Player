// UI management functionality
export class UIManager {
  constructor(audioPlayer) {
    this.audioPlayer = audioPlayer;
    this.setupUI();
  }

  setupUI() {
    this.setupTabNavigation();
    this.setupPlayerControls();
  }

  setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        // Remove active class from all tabs and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
      });
    });
  }

  setupPlayerControls() {
    const playButton = document.getElementById("play");
    const pauseButton = document.getElementById("pause");
    const nextButton = document.getElementById("next");
    const previousButton = document.getElementById("previous");
    const shuffleButton = document.getElementById("shuffle");

    playButton?.addEventListener("click", () => {
      if (this.audioPlayer.userData?.currentSong === null) {
        this.audioPlayer.playSong(this.audioPlayer.userData?.songs[0]?.id);
      } else {
        this.audioPlayer.playSong(this.audioPlayer.userData?.currentSong.id);
      }
      this.updatePlayerDisplay();
    });

    pauseButton?.addEventListener("click", () => {
      this.audioPlayer.pauseSong();
      this.updatePlayerDisplay();
    });

    nextButton?.addEventListener("click", () => {
      this.audioPlayer.playNextSong();
      this.updatePlayerDisplay();
    });

    previousButton?.addEventListener("click", () => {
      this.audioPlayer.playPreviousSong();
      this.updatePlayerDisplay();
    });

    shuffleButton?.addEventListener("click", () => {
      this.audioPlayer.shuffle();
      this.renderSongs(this.audioPlayer.userData?.songs);
      this.updatePlayerDisplay();
    });

    // Audio ended event
    this.audioPlayer.audio.addEventListener("ended", () => {
      const currentSongIndex = this.audioPlayer.getCurrentSongIndex();
      const nextSongExists = this.audioPlayer.userData?.songs[currentSongIndex + 1] !== undefined;

      if (nextSongExists) {
        this.audioPlayer.playNextSong();
      } else {
        this.audioPlayer.userData.currentSong = null;
        this.audioPlayer.userData.songCurrentTime = 0;
        this.audioPlayer.pauseSong();
      }
      this.updatePlayerDisplay();
    });
  }

  updatePlayerDisplay() {
    const playingSong = document.getElementById("player-song-title");
    const songArtist = document.getElementById("player-song-artist");
    const playButton = document.getElementById("play");
    
    const currentTitle = this.audioPlayer.userData?.currentSong?.title;
    const currentArtist = this.audioPlayer.userData?.currentSong?.artist;

    if (playingSong) playingSong.textContent = currentTitle || "";
    if (songArtist) songArtist.textContent = currentArtist || "";

    // Update play button state
    if (playButton) {
      if (this.audioPlayer.audio.paused) {
        playButton.classList.remove("playing");
      } else {
        playButton.classList.add("playing");
      }
    }

    this.highlightCurrentSong();
    this.setPlayButtonAccessibleText();
  }

  highlightCurrentSong() {
    const playlistSongElements = document.querySelectorAll(".playlist-song");
    const songToHighlight = document.getElementById(
      `song-${this.audioPlayer.userData?.currentSong?.id}`
    );

    playlistSongElements.forEach((songEl) => {
      songEl.removeAttribute("aria-current");
    });

    if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
  }

  setPlayButtonAccessibleText() {
    const playButton = document.getElementById("play");
    const song = this.audioPlayer.userData?.currentSong || this.audioPlayer.userData?.songs[0];
    
    if (playButton) {
      playButton.setAttribute(
        "aria-label",
        song?.title ? `Play ${song.title}` : "Play"
      );
    }
  }

  renderSongs(songs) {
    const playlistSongs = document.getElementById("playlist-songs");
    if (!playlistSongs) return;

    const songsHTML = songs
      .map((song) => {
        return `
        <li id="song-${song.id}" class="playlist-song">
          <button class="playlist-song-info" onclick="window.playSong(${song.id})">
            <span class="playlist-song-title">${song.title}</span>
            <span class="playlist-song-artist">${song.artist}</span>
            <span class="playlist-song-duration">${song.duration}</span>
          </button>
          <button class="playlist-song-delete" aria-label="Delete ${song.title}" onclick="window.deleteSong(${song.id})">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="8" fill="#4d4d62"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/>
            </svg>
          </button>
        </li>
        `;
      })
      .join("");

    playlistSongs.innerHTML = songsHTML;

    // Add reset button if no songs
    if (songs.length === 0) {
      const resetButton = document.createElement("button");
      resetButton.textContent = "Reset Playlist";
      resetButton.id = "reset";
      resetButton.setAttribute("aria-label", "Reset playlist");
      
      resetButton.addEventListener("click", () => {
        // This would need to be implemented based on your reset logic
        console.log("Reset playlist clicked");
      });
      
      playlistSongs.appendChild(resetButton);
    }
  }
}