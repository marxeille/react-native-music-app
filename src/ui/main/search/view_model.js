import AsyncStorage from '@react-native-community/async-storage';
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
import { AsyncStorageKey } from '../../../constant/constant';

export const SearchModel = types
  .model('SearchModel', {
    state: Result,
    recentlyKeyWord: types.maybeNull(types.array(types.string)),
    recentlySong: types.optional(types.map(Song), {}),
    recentlyAlbum: types.optional(types.map(Album), {}),
    recentlyArtist: types.optional(types.map(Artist), {}),
    keyword: types.maybeNull(types.string),
    resultSongs: types.optional(types.map(Song), {}),
    resultAlbums: types.optional(types.map(Album), {}),
    resultArtists: types.optional(types.map(Artist), {}),
  })
  .actions(self => {
    return {
      addRecentlySong(song) {
        if (self.recentlySong.get(song.id)) {
          self.recentlySong.get(song.id).update(song);
        } else {
          const newSong = createSongFromJsonApi(song);
          self.recentlySong.put(newSong);
        }
      },
      addRecentlyArrtist(artist) {
        if (self.recentlyArtist.get(artist.id)) {
          self.recentlyArtist.get(artist.id).update(artist);
        } else {
          const newArtist = createArtistFromApiJson(artist);
          self.recentlyArtist.put(newArtist);
        }
      },
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

      getRecentlyResult: flow(function* getRecentlyResult() {
        const songs = yield AsyncStorage.getItem(
          AsyncStorageKey.RECENTLYSEARCH.SONGS,
        );
        songs?.length > 0 &&
          songs?.forEach(s => {
            let song = createSongFromJsonApi(s);
            self.recentlySong.put(song);
          });

        const artists = yield AsyncStorage.getItem(
          AsyncStorageKey.RECENTLYSEARCH.ARTISTS,
        );
        artists?.length > 0 &&
          artists?.forEach(a => {
            let artist = createArtistFromApiJson(a);
            self.recentlyArtist.put(artist);
          });

        const albums = yield AsyncStorage.getItem(
          AsyncStorageKey.RECENTLYSEARCH.ALBUMS,
        );

        self.state = 'success';
      }),

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
