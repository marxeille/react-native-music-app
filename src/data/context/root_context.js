import React from 'react';
import { UserStore, AuthState } from '../repository/user_store';
import { RootStore } from '../repository/root_store';
import { AppState } from 'react-native';
import { PlayerStore } from '../repository/player_store';
import Song from '../model/song';
import makeInspectable from 'mobx-devtools-mst';
import CommonApiService from '../datasource/common_api_service';
import ApiService from '../datasource/api_service';
import { HomeStore } from '../repository/home_store';
import * as Reactotron from 'reactotron-react-native';
import { mst } from 'reactotron-mst';
import { reactotron } from '../../../ReactotronConfig';
import TrackPlayer, { Event, State } from 'react-native-track-player';
import { unprotect } from 'mobx-state-tree';
import SongOfQueueStore from '../repository/song_of_queue_store';
import * as _ from 'lodash';

export const rootStore = RootStore.create({
  userStore: UserStore.create({
    authState: 'none',
  }),
  playlist: {},
  playerStore: PlayerStore.create({
    currentSong: null,
    statusPlayer: 'pause',
  }),
  homeStore: HomeStore.create({
    state: 'loading',
  }),
  queueStore: SongOfQueueStore.create({ songs: [] }),
  songs: {},
});

TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async data => {
  console.log('data', rootStore.queueStore.songs);

  console.log(
    'compare',
    _.isEqual([...rootStore.songs.values()], rootStore.queueStore.songs),
  );

  const playlistShuffled = !_.isEqual(
    [...rootStore.songs.values()],
    rootStore.queueStore.songs,
  );

  if ((data.nextTrack !== null && !playlistShuffled) || data.track == null) {
    rootStore.playerStore.playSong(data.nextTrack);
  } else {
    console.log('in here');
    await TrackPlayer.reset();
    const queue = await TrackPlayer.getQueue();
    console.log('in here 2', queue);
    console.log(
      'rootStore.queueStore.getSongs()',
      rootStore.queueStore.getSongs(),
    );
    await TrackPlayer.add(rootStore.queueStore.getSongs());
    console.log('in here 3');
    await TrackPlayer.play();
  }
});

TrackPlayer.addEventListener('playback-state', data => {
  if (
    data.state == State.Playing ||
    data.state == State.Connecting ||
    // data.state == State.Buffering ||
    data.state == State.Connecting
  ) {
    rootStore.playerStore.setState('playing');
  } else {
    rootStore.playerStore.setState('pause');
  }
});

export const RootContext = React.createContext(rootStore);
reactotron.trackMstNode(rootStore);
