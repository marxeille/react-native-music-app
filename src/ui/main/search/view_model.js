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
    recentlySong: types.array(Song, []),
    recentlyAlbum: types.maybeNull(types.array(Album)),
    recentlyArtist: types.maybeNull(types.array(Artist)),
    keyword: types.maybeNull(types.string),
    // results: types.maybeNull(types.map(types.frozen({}))),
  })
  .actions(self => {
    return {
      getRecentlySong: flow(function* getRecently() {
        const recently: Array = yield apiService.commonApiService.getSongsOfAlBum();
        console.log('getRecentlySong:flow -> recently', recently);
        recently.forEach(data => {
          console.log('data getRecentlySong', data);
          let song = createSongFromJson(data);
          console.log('getRecentlySong:flow -> song', song);
          self.recentlySong.push(song);
        });
        self.state = 'success';
      }),

      search(keyword) {
        self.keyword = keyword;
        self.state = 'loading';
        //Start Search.
      },
    };
  })
  .views(self => {
    return {};
  });
