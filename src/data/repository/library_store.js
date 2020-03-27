import { Alert } from 'react-native';
import { types, getEnv, flow, getParent } from 'mobx-state-tree';
import { Result } from './result';
import { PlayList } from '../model/playlist';
import { Album } from '../model/album';
import { Artist } from '../model/artist';
import { apiService } from '../context/api_context';

export const LibraryStore = types
  .model('LibraryStore', {
    state: Result,
    albums: types.optional(types.array(types.reference(Album)), []),
    playlists: types.optional(types.array(types.reference(PlayList)), []),
    artists: types.optional(types.array(types.reference(Artist)), []),
  })
  .actions(self => {
    return {
      fetchData() {
        self.state = 'loading';
        self.fetchTabsData();
      },

      fetchTabsData: flow(function* fetchTabsData() {
        self.fetchPlaylist();
        self.fetchArtists();
        self.state = 'success';
      }),

      fetchPlaylist: flow(function* fetchPlaylist() {
        try {
          const playlist: Array = yield apiService.commonApiService.getPlaylists();

          if (playlist.status == 200) {
            playlist.data.map(pl => {
              getParent(self).updatePlayList(pl);
              self.playlists.push(pl.id);
            });
          } else {
            Alert.alert(playlist.data.msg);
          }
        } catch (err) {
          console.log('err ', err);
        }
      }),

      fetchArtists: flow(function* fetchArtists() {
        try {
          const artists: Array = yield apiService.libraryApiService.getArtists();
          if (artists.status == 200) {
            artists.data.map(ar => {
              getParent(self).updateArtist(ar);
              self.artists.push(ar.id);
            });
          } else {
            Alert.alert(artists.data.msg);
          }
        } catch (err) {
          console.log('err ', err);
        }
      }),
    };
  });
