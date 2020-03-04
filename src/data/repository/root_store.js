import { UserStore } from './user_store';
import { PlayerStore } from './player_store';
import { HomeStore } from './home_store';

import { types, flow } from 'mobx-state-tree';
import { PlayList } from '../model/playlist';
import { apiService } from '../context/api_context';
import { Song, createSongFromJson } from '../model/song';
import { Album } from '../model/album';

export const RootStore = types
  .model('RootStore', {
    userStore: UserStore,
    playerStore: PlayerStore,
    homeStore: HomeStore,
    playlist: types.maybeNull(types.map(PlayList)),
    songs: types.maybeNull(types.map(Song)),
    albums: types.maybeNull(types.map(Album)),
  })
  .actions(self => {
    return {

      updatePlayList(playlist) {
        self.playlist.put(playlist)
      },

      updateSongs(values: Array) {
        console.log('DEBUG => root_store values updateSongs', values);
        values.forEach(data => {
          self.songs.put(createSongFromJson(data))
        })
      },

      updateAlbums(values: Array) {
        values.forEach(data => {
          self.songs.put(data)
        })
      }

    };
  });
