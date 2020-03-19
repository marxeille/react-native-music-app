import { types, getEnv, flow, getParent } from 'mobx-state-tree';
import { Result } from './result';
import { PlayList, createPlaylistFromJson } from '../model/playlist';
import { apiService } from '../context/api_context';
import { Album } from '../model/album';

export const HomeStore = types
  .model('HomeStore', {
    state: Result,
    recently: types.array(types.reference(Album)),
    popular: types.array(types.reference(PlayList), []),
    suggesst: types.array(types.reference(PlayList)),
  })
  .actions(self => {
    return {
      // #region Fetch Data Home
      fetchData() {
        self.state = 'loading';
        self.fetchPopularPlayList();
      },
      //#endregion
      //#region Handle Fect Popular Success
      fetchPopularPlayList: flow(function* fetchPopularPlayList() {
        const playlist: Array = yield apiService.commonApiService.getPopularPlayList();
        playlist.forEach(data => {
          self.popular.push(data.id);
          getParent(self).updatePlayList(data);
        });
        self.state = 'success';
      }),
      // #endregion
    };
  });
