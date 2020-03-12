import { types, flow } from 'mobx-state-tree';
import { Result } from '../../../data/repository/result';
import { Song, createSongFromJson } from '../../../data/model/song';
import { apiService } from '../../../data/context/api_context';
import { Artist } from '../../../data/model/artist';
import { Album } from '../../../data/model/album';

export const SearchModel = types
  .model('SearchModel', {
    state: Result,
    recentlyKeyWord: types.maybeNull(types.array(types.string)),
    recentlySong: types.map(Song),
    recentlyAlbum: types.maybeNull(types.map(Album)),
    recentlyArtist: types.maybeNull(types.map(Artist)),
    keyword: types.maybeNull(types.string),
    // results: types.maybeNull(types.map(types.frozen({}))),
  })
  .actions(self => {
    return {
      getRecentlySong: flow(function* getRecently() {
        const recently: Array = yield apiService.commonApiService.getSongsOfAlBum();
        recently.forEach(data => {
          let song = createSongFromJson(data);
          self.recentlySong.put(song);
        });

        self.state = 'success';
      }),

      removeRecentlySong(id) {
        self.recentlySong.delete(id);
      },

      removeAllRecently() {
        self.recentlySong.clear();
      },

      searchByKeyword: flow(function* searchByKeyword(keyword) {
        self.keyword = keyword;
        self.state = 'loading';
        const recently: Array = yield apiService.commonApiService.getSongsOfAlBum();
        recently.forEach(data => {
          let song = createSongFromJson(data);
          self.recentlySong.put(song);
        });

        self.state = 'success';
      }),
    };
  })
  .views(self => {
    return {};
  });
