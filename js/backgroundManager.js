// Background management functionality
export class BackgroundManager {
  constructor() {
    this.backgrounds = [
      { name: 'Sound Wave 1', path: './images/soundWave6.gif' },
      { name: 'Sound Wave 2', path: './images/soundwave5.gif' },
      { name: 'Audio Wave', path: './images/AudioWave1.gif' },
      { name: 'Sound Effect', path: './images/SoundEffect3.gif' },
      { name: 'Sound 4', path: './images/Sound4.gif' },
      { name: 'Static Wolf', path: './images/WOLF.png' },
      { name: 'Static Dragon', path: './images/dragon.png' },
      { name: 'Static Planet', path: './images/planet.png' },
      { name: 'Static Plane', path: './images/plane.png' },
      { name: 'Static Halo', path: './images/halo.png' },
      { name: 'Static LOTR', path: './images/LOTR.png' }
    ];
    this.currentBackground = this.loadCurrentBackground();
    this.setupBackgroundSelector();
    this.applyBackground();
  }

  setupBackgroundSelector() {
    const backgroundSelect = document.getElementById('background-select');
    if (backgroundSelect) {
      // Populate options
      backgroundSelect.innerHTML = this.backgrounds.map((bg, index) => 
        `<option value="${index}" ${index === this.currentBackground ? 'selected' : ''}>${bg.name}</option>`
      ).join('');

      // Add change listener
      backgroundSelect.addEventListener('change', (e) => {
        this.changeBackground(parseInt(e.target.value));
      });
    }
  }

  changeBackground(index) {
    if (index >= 0 && index < this.backgrounds.length) {
      this.currentBackground = index;
      this.applyBackground();
      this.saveCurrentBackground();
    }
  }

  applyBackground() {
    const playerDisplay = document.querySelector('.player-display');
    if (playerDisplay && this.backgrounds[this.currentBackground]) {
      const bg = this.backgrounds[this.currentBackground];
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

  saveCurrentBackground() {
    localStorage.setItem('currentBackground', this.currentBackground.toString());
  }

  loadCurrentBackground() {
    const saved = localStorage.getItem('currentBackground');
    return saved ? parseInt(saved) : 0;
  }
}