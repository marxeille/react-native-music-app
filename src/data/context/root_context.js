import React from 'react';
import { UserStore } from '../repository/user_store';
import { RootStore } from '../repository/root_store';
import { PlayerStore } from '../repository/player_store';
import { HomeStore } from '../repository/home_store';
import { reactotron } from '../../../ReactotronConfig';
import SongOfQueueStore from '../repository/song_of_queue_store';
import * as _ from 'lodash';
import { LibraryStore } from '../repository/library_store';
import SongOfAlPlaylistStore from '../repository/song_of_playlist_store';

export const rootStore = RootStore.create({
  userStore: UserStore.create({
    authState: 'none',
  }),
  playlist: {},
  artist: {},
  playerStore: PlayerStore.create({
    currentSong: null,
    statusPlayer: 'playing',
  }),
  homeStore: HomeStore.create({
    state: 'success',
  }),
  libraryStore: LibraryStore.create({
    state: 'loading',
  }),
  queueStore: SongOfQueueStore.create({ songs: [] }),
  playlistSongStore: SongOfAlPlaylistStore.create({ song: [] }),
  songs: {},
});

// TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async data => {
//   const playlistShuffled = !_.isEqual(
//     [...rootStore.songs.values()],
//     rootStore.queueStore.songs,
//   );

//   if ((data.nextTrack !== null && !playlistShuffled) || data.track == null) {
//     rootStore.playerStore.playSong(data.nextTrack);
//   } else {
//     await TrackPlayer.reset();
//     await TrackPlayer.add(rootStore.queueStore.getSongs());
//     await TrackPlayer.play();
//   }
// });

// TrackPlayer.addEventListener('playback-state', data => {
//   if (
//     data.state == State.Playing ||
//     data.state == State.Connecting ||
//     // data.state == State.Buffering ||
//     data.state == State.Connecting
//   ) {
//     rootStore.playerStore.setState('playing');
//   } else {
//     rootStore.playerStore.setState('pause');
//   }
// });

export const RootContext = React.createContext(rootStore);
reactotron.trackMstNode(rootStore);
