
import React from 'react';
import { UserStore, AuthState } from '../repository/user_store';
import { RootStore } from '../repository/root_store'
import { AppState } from 'react-native';
import { PlayerStore } from '../repository/player_store';
import Song from '../model/song';
import makeInspectable from 'mobx-devtools-mst';
import CommonApiService from '../datasource/common_api_service';
import ApiService from '../datasource/api_service';
import { HomeStore } from '../repository/home_store';
import * as Reactotron from "reactotron-react-native"
import { mst } from "reactotron-mst"
import { reactotron } from '../../../ReactotronConfig';
import TrackPlayer, { Event } from 'react-native-track-player';
import { unprotect } from 'mobx-state-tree';

export const rootStore = RootStore.create({
  userStore: UserStore.create({
    authState: 'none'
  }),
  playlist: {},
  playerStore: PlayerStore.create(
    {
      currentSong: null,
      statusPlayer: 'pause'
    }
  ),
  homeStore: HomeStore.create({
    state: 'loading',
  }),

});

TrackPlayer.addEventListener(Event.PlaybackTrackChanged, (data) => {
  console.log("PlaybackTrackChanged data", data);
  unprotect(rootStore.playerStore);
  rootStore.playerStore.currentSong = data.nextTrack;
})



export const RootContext = React.createContext(
  rootStore
);
reactotron.trackMstNode(rootStore)
