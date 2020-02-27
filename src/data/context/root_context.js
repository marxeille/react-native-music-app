
import React from 'react';
import { UserStore, AuthState } from '../repository/user_store';
import { RootStore } from '../repository/root_store'
import { AppState } from 'react-native';
import { PlayerStore } from '../repository/player_store';
import Song from '../model/song';
import makeInspectable from 'mobx-devtools-mst';


const userStore = UserStore.create({
  authState: 'none'
});
const playerStore = PlayerStore.create(
  {
    currentSong: {
      name: "Chiều Hôm Ấy",
      thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
      artist: 'Dang Ngoc Duc'
    },
    statusPlayer: 'pause'
  }
);

export const rootStore = RootStore.create({
  userStore: userStore,
  playerStore: playerStore
})

makeInspectable(rootStore)

export const RootContext = React.createContext(
  rootStore
);