const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.querySelector("#next");
const previousButton = document.querySelector("#previous");
const shuffleButton = document.querySelector("#shuffle");

//Arrays with songs
const allSongs = [
  {
    id: 0,
    title: "Love Hurts",
    artist: "Nazareth",
    duration: "4:25",
    src: "./audio/Nazareth   Love Hurts.mp3",
  },
  {
    id: 1,
    title: "Down Under",
    artist: "Ment At Work",
    duration: "4:15",
    src: "./audio/Men At Work   Down Under.mp3",
  },
  {
    id: 2,
    title: "Mirrors",
    artist: "Justin Timberlake",
    duration: "3:51",
    src: "./audio/Justin Timberlake   Mirrors.mp3",
  },
  {
    id: 3,
    title: "I Want to Know What Love Is",
    artist: "Foreigner",
    duration: "3:34",
    src: "./audio/Foreigner   I Want To Know What Love Is.mp3",
  },
  {
    id: 4,
    title: "Everything I Own",
    artist: "Bread",
    duration: "3:35",
    src: "./audio/Everything I Own.mp3",
  },
  {
    id: 5,
    title: "Blue",
    artist: "Eiffel 65",
    duration: "3:12",
    src: "./audio/Eiffel 65   Blue.mp3",
  },
  {
    id: 6,
    title: "Paradise",
    artist: "Coldplay",
    duration: "3:25",
    src: "./audio/Coldplay   Paradise.mp3",
  },
  {
    id: 7,
    title: "Tuesday",
    artist: "Burak Yeter",
    duration: "3:52",
    src: "./audio/Burak Yeter-Tuesday.mp3",
  },
  {
    id: 8,
    title: "Long Gone",
    artist: "Benjamin Todd",
    duration: "3:10",
    src: "./audio/Benjamin Todd-Long Gone.mp3",
  },
  {
    id: 9,
    title: "A Horse With no Name",
    artist: "America",
    duration: "2:43",
    src: "./audio/America   A Horse With No Name .mp3",
  },
  {
    id: 10,
    title: "Don't you know what you've got till it's gone",
    artist: "Cinderella",
    duration: "2:43",
    src: "./audio/Cinderella Don't Know What You Got (Till It's Gone).mp3",
  },
  {
    id: 11,
    title: "Where Are You Now?",
    artist: "Nazareth",
    duration: "2:43",
    src: "audio/Nazareth   Where Are You Now.mp3",
  },
  {
    id: 12,
    title: "Dilema",
    artist: "Nelly",
    duration: "2:43",
    src: "./audio/Nelly   Dilemma.mp3",
  },
  {
    id: 13,
    title: "Live is Life",
    artist: "Opus",
    duration: "2:43",
    src: "./audio/Opus   Live Is Life.mp3",
  },
  {
    id: 14,
    title: "The Nights",
    artist: "Avicii",
    duration: "2:43",
    src: "./audio/Avicii - The Nights.mp3",
  },
  {
    id: 15,
    title: "Another Day in Paradise",
    artist: "Phil Collins",
    duration: "2:43",
    src: "./audio/Phil Collins   Another Day In Paradise.mp3",
  },
  {
    id: 16,
    title: "Wind of Change",
    artist: "Scorpions",
    duration: "2:43",
    src: "./audio/Scorpions   Wind Of Change.mp3",
  },
  {
    id: 17,
    title: "Alors on Danse",
    artist: "Stromae",
    duration: "2:43",
    src: "./audio/Stromae   Alors on Danse.mp3",
  },
  {
    id: 18,
    title: "Africa",
    artist: "Toto",
    duration: "2:43",
    src: "./audio/Toto   Africa.mp3",
  },
  {
    id: 19,
    title: "Tren al Sur",
    artist: "***",
    duration: "2:43",
    src: "./audio/Tren Al Sur.mp3",
  },
  {
    id: 20,
    title: "Stone",
    artist: "Whiskey Mayers",
    duration: "2:43",
    src: "./audio/Whiskey Myers   Stone.mp3",
  },
];

//audio API?
const audio = new Audio();

let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};
//Let's start adding functionality
const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }
  userData.currentSong = song;
  playButton.classList.add("playing");
  highlightCurrentSong(); 
  setPlayerDisplay(); 
  setPlayButtonAccessibleText();
  audio.play();
};

//function to display current song and artist
const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

//function to stop the songs
const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;

  playButton.classList.remove("playing");
  audio.pause();
};
//functions for the next and previous songs
const playNextSong = () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];

    playSong(nextSong.id);
  }
};

//previous song functionality
const playPreviousSong = () => {
  if (userData?.currentSong === null) return;
  else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];

    playSong(previousSong.id);
  }
};

//Function to shuffle the songs
const shuffle = () => {
  userData?.songs.sort(() => Math.random() - 0.5);
  userData.currentSong = null;
  userData.songCurrentTime = 0;

  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
};

//function for deleting songs
const deleteSong = (id) => {
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    pauseSong();
    setPlayerDisplay();
  }

  userData.songs = userData?.songs.filter((song) => song.id !== id);
  renderSongs(userData?.songs);
  highlightCurrentSong();
  setPlayButtonAccessibleText();

  if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");
    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";

    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs];

      renderSongs(sortSongs());
      setPlayButtonAccessibleText();
      resetButton.remove();
    });
  }
};

///hightlighting playing songs functionality
const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};
//
const renderSongs = (array) => {
  ////////////this is how map() works:
  //const numbers = [1, 2, 3];
  //const doubledNumbers = numbers.map((number) => number * 2); // doubledNumbers will be [2, 4, 6]

  const songsHTML = array
    .map((song) => {
      return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick= 'playSong(${song.id})'>
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button class="playlist-song-delete" aria-label="Delete ${song.title}" onclick="deleteSong(${song.id})">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li>
      `;
    })
    .join("");

  playlistSongs.innerHTML = songsHTML; //access the html ul so that it gets updated with this <=
};


//Function to change the aria-label?
const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];
  playButton.setAttribute(
    "aria-label",
    song?.title ? `Play ${song.title}` : "Play"
  );
};

//
const getCurrentSongIndex = () => {
  return userData?.songs.indexOf(userData?.currentSong);
};

//////////////////EVENT LISTENERS///////////////////////////////

playButton.addEventListener("click", () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    playSong(userData?.currentSong.id);
  }
});

//call the eventListener to pause the song/give use of the pauseButton
pauseButton.addEventListener("click", pauseSong);

//call the eventlistener to play the next song
nextButton.addEventListener("click", playNextSong);
//call the eventlistener to play the previous song
previousButton.addEventListener("click", playPreviousSong);

//event listenr to shuffle the songs
shuffleButton.addEventListener("click", shuffle);

//event listener to play the song once the previous ends
audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex();
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;

  if (nextSongExists) {
    playNextSong();
  } else {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
  }
  //call all these functions here
  pauseSong();
  setPlayerDisplay();
  highlightCurrentSong();
  setPlayButtonAccessibleText();
});

///////////////////////END OF EVENT LISTENERS//////////////////////////////////

//alphabetical ordering the songs
userData?.songs.sort((a, b) => {
  // The reason why this example is returning numbers is because the sort() method is expecting a number to be returned. If you return a negative number, the first item is sorted before the second item.
  if (a.title < b.title) {
    return -1;
  }
  if (a.title > b.title) {
    return 1;
  }
  //In the example, if a.name is equal to b.name, then the function returns 0. This means that nothing changes and the order of a and b remains the same.
  return 0;
});

//call that function so that the songs can be displayed on the UI
renderSongs(userData?.songs);
