// Main application entry point
import { allSongs } from "./constants.js";
import { AudioPlayer } from "./audioPlayer.js";
import { UIManager } from "./uiManager.js";
import { FileUploadManager } from "./fileUpload.js";
import { VideoPlayer } from "./videoPlayer.js";
import { BackgroundManager } from "./backgroundManager.js";

class MusicPlayerApp {
  constructor() {
    this.audioPlayer = new AudioPlayer();
    this.uiManager = new UIManager(this.audioPlayer);
    this.fileUploadManager = new FileUploadManager(
      this.audioPlayer,
      this.uiManager
    );
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

    console.log("Music Player App initialized");
  }

  setupProgressControls() {
    // Audio progress bar click handler
    const progressContainer = document.getElementById("progress-container");
    if (progressContainer) {
      progressContainer.addEventListener("click", (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const percentage = ((e.clientX - rect.left) / rect.width) * 100;
        this.audioPlayer.seekTo(percentage);
      });
    }

    // Video progress bar click handler
    const videoProgressContainer = document.getElementById(
      "video-progress-container"
    );
    if (videoProgressContainer) {
      videoProgressContainer.addEventListener("click", (e) => {
        const rect = videoProgressContainer.getBoundingClientRect();
        const percentage = ((e.clientX - rect.left) / rect.width) * 100;
        this.videoPlayer.seekVideo(percentage);
      });
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MusicPlayerApp();

  // Footer copyright logic
  const yearSpan = document.getElementById("footer-year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Settings modal logic
  const settingsBtn = document.getElementById("settings-btn");
  const settingsModal = document.getElementById("settings-modal");
  const closeSettingsBtn = document.getElementById("close-settings-btn");
  const languageSelect = document.getElementById("language-select");

  if (settingsBtn && settingsModal && closeSettingsBtn) {
    settingsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      settingsModal.classList.add("active");
      // Position modal below and right-aligned to the button
      const btnRect = settingsBtn.getBoundingClientRect();
      settingsModal.style.top = window.scrollY + btnRect.bottom + 8 + "px";
      settingsModal.style.right = window.innerWidth - btnRect.right + "px";
    });
    closeSettingsBtn.addEventListener("click", () => {
      settingsModal.classList.remove("active");
    });
    document.addEventListener("click", (e) => {
      if (!settingsModal.contains(e.target) && e.target !== settingsBtn) {
        settingsModal.classList.remove("active");
      }
    });
  }

  // Language switching logic
  if (languageSelect) {
    const translations = {
      en: {
        playlist: "Playlist",
        uploadMusic: "Upload Music",
        videos: "Videos",
        addYourMusic: "Add Your Music",
        uploadDesc: "Upload audio files from your device",
        supportedFormats: "Supported formats:",
        chooseAudio: "Choose Audio Files",
        videoPlayer: "Video Player",
        uploadVideo: "Upload Video File",
        chooseVideo: "Choose Video Files",
        addVideoUrl: "Add Video URL",
        enterVideoUrl: "Enter video URL (YouTube, Vimeo, etc.)",
        addVideo: "Add Video",
        videoPlaylist: "Video Playlist",
        settings: "Settings",
        language: "Language:",
        close: "Close",
        chooseBackground: "Choose Background",
        uploadImage: "Upload Image",
        chooseFiles: "Choose Files",
        addFromUrl: "Add from URL",
        imageUrl: "Image URL",
        add: "Add",
        resetPlaylist: "Reset Playlist",
        edit: "Edit",
        save: "Save",
        copyrightPlaceholder: "Change copyright",
        appDesc:
          "This app is intended for those moments like while going on a plane when you want to listen to music without interruptions, and/or where internet connectivity is limited.",
      },
      es: {
        playlist: "Lista de canciones",
        uploadMusic: "Subir música",
        videos: "Videos",
        addYourMusic: "Agrega tu música",
        uploadDesc: "Sube archivos de audio desde tu dispositivo",
        supportedFormats: "Formatos soportados:",
        chooseAudio: "Elegir archivos de audio",
        videoPlayer: "Reproductor de video",
        uploadVideo: "Subir archivo de video",
        chooseVideo: "Elegir archivos de video",
        addVideoUrl: "Agregar URL de video",
        enterVideoUrl: "Ingresa la URL del video (YouTube, Vimeo, etc.)",
        addVideo: "Agregar video",
        videoPlaylist: "Lista de videos",
        settings: "Configuración",
        language: "Idioma:",
        close: "Cerrar",
        chooseBackground: "Elegir fondo",
        uploadImage: "Subir imagen",
        chooseFiles: "Elegir archivos",
        addFromUrl: "Agregar desde URL",
        imageUrl: "URL de la imagen",
        add: "Agregar",
        resetPlaylist: "Restablecer lista",
        edit: "Editar",
        save: "Guardar",
        copyrightPlaceholder: "Cambiar copyright",
        appDesc:
          "Esta aplicación está pensada para esos momentos, como cuando vas en avión, en los que quieres escuchar música sin interrupciones y/o donde la conectividad a internet es limitada.",
      },
    };
    function updateLanguage(lang) {
      // Tab navigation
      document.querySelector('.tab-btn[data-tab="playlist-tab"]').textContent =
        translations[lang].playlist;
      document.querySelector('.tab-btn[data-tab="upload-tab"]').textContent =
        translations[lang].uploadMusic;
      document.querySelector('.tab-btn[data-tab="video-tab"]').textContent =
        translations[lang].videos;
      // Playlist title
      const playlistTitle = document.querySelector(".playlist-title");
      if (playlistTitle)
        playlistTitle.textContent = translations[lang].playlist;
      // Upload tab
      const addMusic = document.querySelector("#upload-tab h2");
      if (addMusic) addMusic.textContent = translations[lang].addYourMusic;
      const uploadDesc = document.querySelector("#upload-tab .upload-header p");
      if (uploadDesc) uploadDesc.textContent = translations[lang].uploadDesc;
      const supported = document.querySelector(
        "#upload-tab .supported-formats strong"
      );
      if (supported)
        supported.textContent = translations[lang].supportedFormats;
      const chooseAudio = document.querySelector("#upload-tab .upload-btn");
      if (chooseAudio) chooseAudio.textContent = translations[lang].chooseAudio;
      // Video tab
      const videoPlayer = document.querySelector("#video-tab h2");
      if (videoPlayer) videoPlayer.textContent = translations[lang].videoPlayer;
      const uploadVideo = document.querySelector(
        "#video-tab .upload-method h3"
      );
      if (uploadVideo) uploadVideo.textContent = translations[lang].uploadVideo;
      const chooseVideo = document.querySelector("#video-tab .upload-btn");
      if (chooseVideo) chooseVideo.textContent = translations[lang].chooseVideo;
      const addVideoUrl = document.querySelector(
        "#video-tab .upload-method:last-child h3"
      );
      if (addVideoUrl) addVideoUrl.textContent = translations[lang].addVideoUrl;
      const enterVideoUrl = document.getElementById("video-url-input");
      if (enterVideoUrl)
        enterVideoUrl.placeholder = translations[lang].enterVideoUrl;
      const addVideo = document.getElementById("add-video-url-btn");
      if (addVideo) addVideo.textContent = translations[lang].addVideo;
      const videoPlaylist = document.querySelector(
        "#video-tab .video-playlist h3"
      );
      if (videoPlaylist)
        videoPlaylist.textContent = translations[lang].videoPlaylist;
      // Settings modal
      const settingsTitle = document.querySelector(
        ".settings-modal-content h3"
      );
      if (settingsTitle)
        settingsTitle.textContent = translations[lang].settings;
      const langLabel = document.querySelector(
        '.settings-modal-content label[for="language-select"]'
      );
      if (langLabel) langLabel.textContent = translations[lang].language;
      const closeSettings = document.getElementById("close-settings-btn");
      if (closeSettings) closeSettings.textContent = translations[lang].close;
      // Background modal
      const bgTitle = document.querySelector(".background-header h3");
      if (bgTitle) bgTitle.textContent = translations[lang].chooseBackground;
      const uploadImage = document.querySelector(
        ".background-upload-section .upload-method h4"
      );
      if (uploadImage) uploadImage.textContent = translations[lang].uploadImage;
      const chooseFiles = document.querySelector(".upload-btn-small");
      if (chooseFiles) chooseFiles.textContent = translations[lang].chooseFiles;
      const addFromUrl = document.querySelector(
        ".background-upload-section .upload-method:last-child h4"
      );
      if (addFromUrl) addFromUrl.textContent = translations[lang].addFromUrl;
      const imageUrl = document.getElementById("background-url-input");
      if (imageUrl) imageUrl.placeholder = translations[lang].imageUrl;
      const addBg = document.getElementById("add-background-url-btn");
      if (addBg) addBg.textContent = translations[lang].add;
      // Footer
      const footerDesc = document.querySelector(".footer-description");
      if (footerDesc) footerDesc.textContent = translations[lang].appDesc;
      // Copyright
      const copyrightInput = document.getElementById("copyright-input");
      if (copyrightInput)
        copyrightInput.placeholder = translations[lang].copyrightPlaceholder;
      const editBtn = document.getElementById("edit-copyright-btn");
      if (editBtn) editBtn.textContent = translations[lang].edit;
      const saveBtn = document.getElementById("save-copyright-btn");
      if (saveBtn) saveBtn.textContent = translations[lang].save;
      // Playlist reset
      const resetBtn = document.getElementById("reset");
      if (resetBtn) resetBtn.textContent = translations[lang].resetPlaylist;
    }
    languageSelect.addEventListener("change", (e) => {
      const lang = e.target.value;
      localStorage.setItem("musicPlayerLang", lang);
      updateLanguage(lang);
    });
    // Load saved language
    const savedLang = localStorage.getItem("musicPlayerLang") || "en";
    languageSelect.value = savedLang;
    updateLanguage(savedLang);
  }
});
