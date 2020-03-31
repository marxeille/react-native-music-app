import { types, flow } from 'mobx-state-tree';
import { Result } from '../../../data/repository/result';
import {
  Song,
  createSongFromJsonApi,
  createSongFromJson,
} from '../../../data/model/song';
import { apiService } from '../../../data/context/api_context';
import { Artist, createArtistFromApiJson } from '../../../data/model/artist';
import { Album } from '../../../data/model/album';
import { getTrackFullDetail } from '../../../data/datasource/api_helper';

export const SearchModel = types
  .model('SearchModel', {
    state: Result,
    recentlyKeyWord: types.maybeNull(types.array(types.string)),
    recentlySong: types.map(Song),
    recentlyAlbum: types.maybeNull(types.map(Album)),
    recentlyArtist: types.maybeNull(types.map(Artist)),
    keyword: types.maybeNull(types.string),
    resultSongs: types.optional(types.map(Song), {}),
    resultAlbums: types.optional(types.map(Album), {}),
    resultArtists: types.optional(types.map(Artist), {}),
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

      removeAllSearchResult() {
        self.resultSongs.clear();
        self.resultAlbums.clear();
        self.resultArtists.clear();
      },

      setResultSong(song) {
        self.resultSongs.put(song);
      },

      setResultArtist(artist) {
        self.resultArtists.put(artist);
      },

      searchByKeyword: flow(function* searchByKeyword(keyword) {
        self.keyword = keyword;
        self.state = 'loading';

        try {
          const result: Array = yield apiService.commonApiService.searchByKeyword(
            keyword,
          );
          self.removeAllSearchResult();
          if (result.status == 200) {
            if (result.data.hits.tracks.length > 0) {
              result.data.hits.tracks.forEach(data => {
                getTrackFullDetail(data.id).then(res => {
                  const song = createSongFromJsonApi({ ...data, ...res });
                  self.setResultSong(song);
                });
              });
            }
            if (result.data.hits.artists.length > 0) {
              result.data.hits.artists.forEach(data => {
                let artist = createArtistFromApiJson(data);
                self.setResultArtist(artist);
              });
            }
          }
        } catch (err) {
          console.log('err', err);
        }

        self.state = 'success';
      }),
    };
  })
  .views(self => {
    return {};
  });
