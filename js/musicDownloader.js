// Music download functionality
export class MusicDownloader {
  constructor(audioPlayer, uiManager) {
    this.audioPlayer = audioPlayer;
    this.uiManager = uiManager;
    this.setupDownloadFeatures();
  }

  setupDownloadFeatures() {
    this.setupSearchFunctionality();
    this.setupUrlConverter();
    this.setupFreeMusic();
  }

  setupSearchFunctionality() {
    const searchBtn = document.getElementById('search-music-btn');
    const searchInput = document.getElementById('music-search-input');

    if (searchBtn && searchInput) {
      searchBtn.addEventListener('click', () => this.searchMusic());
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.searchMusic();
      });
    }
  }

  setupUrlConverter() {
    const convertBtn = document.getElementById('convert-url-btn');
    const urlInput = document.getElementById('audio-url-input');

    if (convertBtn && urlInput) {
      convertBtn.addEventListener('click', () => this.convertUrl());
      urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.convertUrl();
      });
    }
  }

  setupFreeMusic() {
    const freeMusicBtn = document.getElementById('free-music-btn');
    if (freeMusicBtn) {
      freeMusicBtn.addEventListener('click', () => this.showFreeMusic());
    }
  }

  async searchMusic() {
    const searchInput = document.getElementById('music-search-input');
    const query = searchInput.value.trim();
    
    if (!query) {
      this.showNotification('Please enter a song name or artist');
      return;
    }

    this.showNotification('Searching for legal download sources...');
    
    // Create search results with legal sources
    const searchResults = this.generateSearchResults(query);
    this.displaySearchResults(searchResults);
  }

  generateSearchResults(query) {
    const legalSources = [
      {
        name: 'Free Music Archive',
        url: `https://freemusicarchive.org/search?adv=1&quicksearch=${encodeURIComponent(query)}`,
        description: 'Royalty-free music downloads'
      },
      {
        name: 'Jamendo',
        url: `https://www.jamendo.com/search?q=${encodeURIComponent(query)}`,
        description: 'Creative Commons music'
      },
      {
        name: 'Internet Archive',
        url: `https://archive.org/search.php?query=${encodeURIComponent(query)}&and[]=mediatype%3A%22audio%22`,
        description: 'Public domain audio files'
      },
      {
        name: 'Bandcamp',
        url: `https://bandcamp.com/search?q=${encodeURIComponent(query)}`,
        description: 'Independent artist music'
      },
      {
        name: 'SoundCloud',
        url: `https://soundcloud.com/search?q=${encodeURIComponent(query)}`,
        description: 'User-generated content (check licensing)'
      }
    ];

    return legalSources;
  }

  displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    const resultsHTML = results.map(source => `
      <div class="search-result-item">
        <div class="search-result-info">
          <h4>${source.name}</h4>
          <p>${source.description}</p>
        </div>
        <button class="search-result-btn" onclick="window.open('${source.url}', '_blank')">
          Visit Site
        </button>
      </div>
    `).join('');

    resultsContainer.innerHTML = `
      <div class="search-results-header">
        <h3>Legal Music Sources</h3>
        <p>Click to visit these sites and download music legally:</p>
      </div>
      ${resultsHTML}
    `;
  }

  async convertUrl() {
    const urlInput = document.getElementById('audio-url-input');
    const url = urlInput.value.trim();
    
    if (!url) {
      this.showNotification('Please enter a valid URL');
      return;
    }

    // Check if it's a direct audio file
    if (this.isDirectAudioUrl(url)) {
      this.addDirectAudioUrl(url);
      return;
    }

    // For other URLs, provide guidance
    this.showNotification('For copyrighted content, please ensure you have permission to download');
    this.showUrlGuidance(url);
  }

  isDirectAudioUrl(url) {
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac'];
    return audioExtensions.some(ext => url.toLowerCase().includes(ext));
  }

  addDirectAudioUrl(url) {
    try {
      const urlObj = new URL(url);
      const filename = urlObj.pathname.split('/').pop() || 'Audio File';
      
      const song = {
        title: filename.replace(/\.[^/.]+$/, ""),
        artist: "Web Source",
        duration: "0:00",
        src: url,
        isUserUploaded: true
      };

      const addedSong = this.audioPlayer.addSong(song);
      this.uiManager.renderSongs(this.audioPlayer.userData.songs);
      this.showNotification(`Added: ${song.title}`);
      
      document.getElementById('audio-url-input').value = '';
    } catch (error) {
      this.showNotification('Invalid URL format');
    }
  }

  showUrlGuidance(url) {
    const guidanceContainer = document.getElementById('url-guidance');
    if (!guidanceContainer) return;

    let guidance = '';
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      guidance = `
        <div class="url-guidance-item">
          <h4>YouTube Content</h4>
          <p>For YouTube videos, consider:</p>
          <ul>
            <li>Check if the content is Creative Commons licensed</li>
            <li>Use YouTube's own download feature for offline viewing (YouTube Premium)</li>
            <li>Contact the creator for permission</li>
          </ul>
        </div>
      `;
    } else if (url.includes('soundcloud.com')) {
      guidance = `
        <div class="url-guidance-item">
          <h4>SoundCloud Content</h4>
          <p>For SoundCloud tracks:</p>
          <ul>
            <li>Look for tracks with download enabled by the artist</li>
            <li>Check the track's licensing information</li>
            <li>Contact the artist directly for permission</li>
          </ul>
        </div>
      `;
    } else {
      guidance = `
        <div class="url-guidance-item">
          <h4>General Guidance</h4>
          <p>For any online content:</p>
          <ul>
            <li>Ensure you have permission to download</li>
            <li>Check the site's terms of service</li>
            <li>Look for official download options</li>
            <li>Respect copyright laws</li>
          </ul>
        </div>
      `;
    }

    guidanceContainer.innerHTML = guidance;
  }

  async showFreeMusic() {
    const freeMusicContainer = document.getElementById('free-music-list');
    if (!freeMusicContainer) return;

    // Sample free music from various sources
    const freeMusic = [
      {
        title: "Acoustic Guitar Loop",
        artist: "Free Music Archive",
        url: "https://freemusicarchive.org/",
        description: "Royalty-free acoustic guitar track"
      },
      {
        title: "Electronic Ambient",
        artist: "Jamendo",
        url: "https://www.jamendo.com/",
        description: "Creative Commons electronic music"
      },
      {
        title: "Classical Piano",
        artist: "Internet Archive",
        url: "https://archive.org/",
        description: "Public domain classical recordings"
      },
      {
        title: "Indie Rock",
        artist: "Bandcamp",
        url: "https://bandcamp.com/",
        description: "Independent artist music"
      }
    ];

    const freeMusicHTML = freeMusic.map(track => `
      <div class="free-music-item">
        <div class="free-music-info">
          <h4>${track.title}</h4>
          <p><strong>Source:</strong> ${track.artist}</p>
          <p>${track.description}</p>
        </div>
        <button class="free-music-btn" onclick="window.open('${track.url}', '_blank')">
          Browse ${track.artist}
        </button>
      </div>
    `).join('');

    freeMusicContainer.innerHTML = `
      <div class="free-music-header">
        <h3>Free & Legal Music Sources</h3>
        <p>Explore these platforms for royalty-free and Creative Commons music:</p>
      </div>
      ${freeMusicHTML}
    `;
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