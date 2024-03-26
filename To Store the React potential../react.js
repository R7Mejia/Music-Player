// //clasicos.jsx
// import React from "react";

// const Clasicos = ({ songs, playSong }) => {
//   return (
//     <div>
//       <h2>Clásicos</h2>
//       <ul>
//         {songs.map((song) => (
//           <li key={song.id}>
//             <button onClick={() => playSong(song.id)}>
//               {song.title} - {song.artist}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Clasicos;

// //MusicaVariada.jsx
// import React from 'react';

// const MusicaVariada = ({ songs, playSong }) => {
//   return (
//     <div>
//       <h2>Música Variada</h2>
//       <ul>
//         {songs.map((song) => (
//           <li key={song.id}>
//             <button onClick={() => playSong(song.id)}>
//               {song.title} - {song.artist}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MusicaVariada;

// //App.jsx
// import React, { useState } from 'react';
// import Clasicos from './Clasicos';
// import MusicaVariada from './MusicaVariada';

// const App = () => {
//   const [songs] = useState([
//     // Paste the array of songs here
//   ]);

//   const playSong = (id) => {
//     // Implement playSong function here
//   };

//   return (
//     <div>
//       <h1>Music Player</h1>
//       <Clasicos songs={songs} playSong={playSong} />
//       <MusicaVariada songs={songs} playSong={playSong} />
//     </div>
//   );
// };

// export default App;
