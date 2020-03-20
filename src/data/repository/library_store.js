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
    atirst: types.optional(types.array(types.reference(Artist)), []),
  })
  .actions(self => {
    return {
      fetchData() {
        self.state = 'loading';
        self.fetchPlayList();
      },

      fetchPlayList: flow(function* fetchPlayList() {
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

        self.state = 'success';
      }),
    };
  });
