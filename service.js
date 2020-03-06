/**
 * This is the code that will run tied to the player.
 *
 * The code here might keep running in the background.
 *
 * You should put everything here that should be tied to the playback but not the UI
 * such as processing media buttons or analytics
 */

import TrackPlayer from 'react-native-track-player';

module.exports = async function() {
  TrackPlayer.addEventListener('remote-play', () => {
    console.log('player are playing');

    TrackPlayer.play();
  });

  TrackPlayer.addEventListener('remote-pause', () => {
    console.log('player are pause');
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener('remote-next', () => {
    console.log('player are skipToNext');
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener('remote-previous', () => {
    console.log('player are skipToPrevious');
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener('remote-stop', () => {
    console.log('player are destroy');
    TrackPlayer.destroy();
  });
};
