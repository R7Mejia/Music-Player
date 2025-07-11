// Background management functionality
export class BackgroundManager {
  constructor() {
    this.defaultBackgrounds = [
      { name: 'Sound Wave 1', path: './images/soundWave6.gif', isDefault: true },
      { name: 'Sound Wave 2', path: './images/soundwave5.gif', isDefault: true },
      { name: 'Audio Wave', path: './images/AudioWave1.gif', isDefault: true },
      { name: 'Sound Effect', path: './images/SoundEffect3.gif', isDefault: true },
      { name: 'Sound 4', path: './images/Sound4.gif', isDefault: true },
      { name: 'Static Wolf', path: './images/WOLF.png', isDefault: true },
      { name: 'Static Dragon', path: './images/dragon.png', isDefault: true },
      { name: 'Static Planet', path: './images/planet.png', isDefault: true },
      { name: 'Static Plane', path: './images/plane.png', isDefault: true },
      { name: 'Static Halo', path: './images/halo.png', isDefault: true },
      { name: 'Static LOTR', path: './images/LOTR.png', isDefault: true }
    ];
    this.userBackgrounds = this.loadUserBackgrounds();
    this.currentBackground = this.loadCurrentBackground();
    this.setupBackgroundControls();
    this.applyBackground();
  }

  get allBackgrounds() {
    return [...this.defaultBackgrounds, ...this.userBackgrounds];
  }

  setupBackgroundControls() {
    this.setupBackgroundButton();
    this.setupBackgroundModal();
    this.setupFileUpload();
    this.setupUrlInput();
  }

  setupBackgroundButton() {
    const backgroundBtn = document.getElementById('background-btn');
    if (backgroundBtn) {
      backgroundBtn.addEventListener('click', () => {
        this.showBackgroundModal();
      });
    }
  }

  setupBackgroundModal() {
    const modal = document.getElementById('background-modal');
    const closeBtn = document.getElementById('close-background-modal');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideBackgroundModal();
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideBackgroundModal();
        }
      });
    }
  }

  setupFileUpload() {
    const fileInput = document.getElementById('background-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        this.handleFileUpload(e);
      });
    }
  }

  setupUrlInput() {
    const addUrlBtn = document.getElementById('add-background-url-btn');
    if (addUrlBtn) {
      addUrlBtn.addEventListener('click', () => {
        this.handleUrlInput();
      });
    }
  }

  showBackgroundModal() {
    const modal = document.getElementById('background-modal');
    if (modal) {
      this.renderBackgroundOptions();
      modal.style.display = 'flex';
    }
  }

  hideBackgroundModal() {
    const modal = document.getElementById('background-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  renderBackgroundOptions() {
    const container = document.getElementById('background-options');
    if (!container) return;

    const backgroundsHTML = this.allBackgrounds.map((bg, index) => `
      <div class="background-option ${index === this.currentBackground ? 'selected' : ''}" 
           onclick="window.backgroundManager.selectBackground(${index})">
        <div class="background-preview" style="background-image: url('${bg.path}')"></div>
        <span class="background-name">${bg.name}</span>
        ${!bg.isDefault ? `<button class="delete-background-btn" onclick="event.stopPropagation(); window.backgroundManager.deleteBackground(${index})">×</button>` : ''}
      </div>
    `).join('');

    container.innerHTML = backgroundsHTML;
  }

  selectBackground(index) {
    if (index >= 0 && index < this.allBackgrounds.length) {
      this.currentBackground = index;
      this.applyBackground();
      this.saveCurrentBackground();
      this.renderBackgroundOptions();
      this.showNotification(`Background changed to: ${this.allBackgrounds[index].name}`);
    }
  }

  deleteBackground(index) {
    const bg = this.allBackgrounds[index];
    if (bg && !bg.isDefault) {
      // Remove from user backgrounds
      const userIndex = this.userBackgrounds.findIndex(userBg => userBg.path === bg.path);
      if (userIndex !== -1) {
        this.userBackgrounds.splice(userIndex, 1);
        this.saveUserBackgrounds();
        
        // Adjust current background index if needed
        if (index === this.currentBackground) {
          this.currentBackground = 0; // Reset to first default background
          this.applyBackground();
          this.saveCurrentBackground();
        } else if (index < this.currentBackground) {
          this.currentBackground--;
          this.saveCurrentBackground();
        }
        
        this.renderBackgroundOptions();
        this.showNotification(`Background deleted: ${bg.name}`);
      }
    }
  }

  handleFileUpload(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        // Create unique URL for user privacy
        const url = URL.createObjectURL(file);
        const background = {
          name: file.name.replace(/\.[^/.]+$/, ""),
          path: url,
          isDefault: false,
          isUserUploaded: true
        };

        this.userBackgrounds.push(background);
        this.saveUserBackgrounds();
        this.renderBackgroundOptions();
        this.showNotification(`Background added: ${background.name}`);
      }
    });
  }

  handleUrlInput() {
    const urlInput = document.getElementById('background-url-input');
    const url = urlInput.value.trim();
    
    if (url) {
      // Extract name from URL or use URL as name
      let name = url;
      try {
        const urlObj = new URL(url);
        name = urlObj.pathname.split('/').pop() || urlObj.hostname;
      } catch (e) {
        name = 'Custom Background';
      }

      const background = {
        name: name,
        path: url,
        isDefault: false,
        isUserUploaded: false
      };

      this.userBackgrounds.push(background);
      this.saveUserBackgrounds();
      this.renderBackgroundOptions();
      this.showNotification(`Background added: ${background.name}`);
      
      urlInput.value = '';
    }
  }

  applyBackground() {
    const playerDisplay = document.querySelector('.player-display');
    if (playerDisplay && this.allBackgrounds[this.currentBackground]) {
      const bg = this.allBackgrounds[this.currentBackground];
      if (bg.path.endsWith('.gif')) {
        playerDisplay.style.backgroundImage = `url("${bg.path}")`;
        playerDisplay.style.backgroundSize = '100%';
        playerDisplay.style.backgroundRepeat = 'no-repeat';
        playerDisplay.style.backgroundPosition = 'center';
      } else {
        playerDisplay.style.backgroundImage = `url("${bg.path}")`;
        playerDisplay.style.backgroundSize = 'cover';
        playerDisplay.style.backgroundRepeat = 'no-repeat';
        playerDisplay.style.backgroundPosition = 'center';
      }
    }
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

  saveCurrentBackground() {
    // Use unique storage key for user privacy
    const storageKey = `currentBackground_${this.getUserId()}`;
    localStorage.setItem(storageKey, this.currentBackground.toString());
  }

  loadCurrentBackground() {
    const storageKey = `currentBackground_${this.getUserId()}`;
    const saved = localStorage.getItem(storageKey);
    return saved ? parseInt(saved) : 0;
  }

  saveUserBackgrounds() {
    // Use unique storage key for user privacy
    const storageKey = `userBackgrounds_${this.getUserId()}`;
    localStorage.setItem(storageKey, JSON.stringify(this.userBackgrounds));
  }

  loadUserBackgrounds() {
    const storageKey = `userBackgrounds_${this.getUserId()}`;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
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