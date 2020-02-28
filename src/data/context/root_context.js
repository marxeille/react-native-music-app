
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

export const rootStore = RootStore.create({

  userStore: UserStore.create({
    authState: 'none'
  }),

  playerStore: PlayerStore.create(
    {
      currentSong: {
        name: "Chiều Hôm Ấy",
        thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
        artist: 'Dang Ngoc Duc'
      },
      statusPlayer: 'pause'
    }
  ),
  homeStore: HomeStore.create({
    state: 'loading',

  })
})

makeInspectable(rootStore)

export const RootContext = React.createContext(
  rootStore
);