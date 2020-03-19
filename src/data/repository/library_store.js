import { types, getEnv, flow, getParent } from 'mobx-state-tree';
import { Result } from './result';
import { PlayList, createPlaylistFromJson } from '../model/playlist';
import { apiService } from '../context/api_context';
import { Album } from '../model/album';
import { Artist } from '../model/artist';

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
          const playlist: Array = yield apiService.commonApiService.getLibraryPlaylists();
          playlist.forEach(data => {
            if (data.status == 200) {
              self.playlists.push(data.id);
              getParent(self).updatePlayList(data);
            }
          });
        } catch (err) {
          console.log('err ', err);
        }

        self.state = 'success';
      }),
    };
  });
