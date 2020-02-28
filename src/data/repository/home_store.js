import { types, getEnv, flow } from 'mobx-state-tree';
import { Result } from './result'
import { PlayList } from '../model/playlist';
import { apiService } from '../context/api_context';

export const HomeStore = types.model("HomeStore", {
  state: Result,
  recently: types.array(PlayList),
  popular: types.array(PlayList),
  suggesst: types.array(PlayList),
}).actions(self => {
  return {
    fetchData() {
      self.state = 'loading';
      self.fetchPopularPlayList();
    },
    fetchPopularPlayList: flow(
      function* fetchPopularPlayList() {
        var playlist: Array = yield apiService.commonApiService.getPopularPlayList();
        self.popular = playlist.map(data => {
          return PlayList.create(
            {
              name: data.name,
              thumb: data.thumb,
              artist: data.artist
            }
          );
        });
        self.recently = playlist.map(data => {
          return PlayList.create(
            {
              name: data.name,
              thumb: data.thumb,
              artist: data.artist
            }
          );
        });

        self.suggesst = playlist.map(data => {
          return PlayList.create(
            {
              name: data.name,
              thumb: data.thumb,
              artist: data.artist
            }
          );
        });

        self.state = 'success'
      }
    ),
  }
})