import { UserStore } from './user_store';
import { PlayerStore } from './player_store';
import { HomeStore } from './home_store';

import { types, flow } from 'mobx-state-tree';
import { PlayList } from '../model/playlist';
import { apiService } from '../context/api_context';
import { Song } from '../model/song';

export const RootStore = types
  .model('RootStore', {
    userStore: UserStore,
    playerStore: PlayerStore,
    homeStore: HomeStore,
    playlist: types.maybeNull(types.map(PlayList)),
    songs: types.maybeNull(types.map(Song)),
  })
  .actions(self => {
    return {
      //Fetch Data Home
      fetchData() {
        self.homeStore.state = 'loading';
        self.fetchPopularPlayList();
      },

      //Handle Fect Popular Success
      fetchPopularPlayList: flow(function* fetchPopularPlayList() {
        var playlist: Array = yield apiService.commonApiService.getPopularPlayList();
        console.log(
          'DEBUG => root_store fetchPopularPlayList playlist',
          playlist.length,
        );
        var populars = [];

        playlist.forEach(data => {
          var teamp = PlayList.create({
            id: data.id,
            name: data.name,
            thumb: data.thumb,
            artist: data.artist,
          });
          self.playlist.put(teamp);
          populars.push(teamp.id);
        });
        self.homeStore.popular = populars;

        self.homeStore.state = 'success';
      }),

      fetchPlayListOfUser: flow(function* fetchPlayListOfUser() {
        var playlist: Array = yield apiService.commonApiService.getPlaylistOfUser();

        var playlistOfUser = [];

        playlist.forEach(data => {
          var teamp = PlayList.create({
            id: data.id,
            name: data.name,
            thumb: data.thumb,
            artist: data.artist,
          });
          self.playlist.put(teamp);
          playlistOfUser.push(teamp.id);
        });
        self.userStore.playlists = playlistOfUser;
      }),

      updateSongs(values: Array) {
        values.forEach(data => {
          self.songs.put(Song.create({
            id: data.id,
            name: data.name,
            artist: data.artist,
            thumb: data.thumb,
            favorite: data.favorite,
          }))
        })
      }

    };
  });
