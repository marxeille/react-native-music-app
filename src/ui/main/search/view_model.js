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
      addToLocalStorage: flow(function* addToLocalStorage(key, data) {
        const preLocalData = yield AsyncStorage.getItem(key);
        const localDataJson = JSON.parse(preLocalData);
        if (localDataJson !== null) {
          //In case there is already a data list in local storage
          if (localDataJson?.length < 10) {
            localDataJson.push(data);
            localDataJson.reverse();
            AsyncStorage.setItem(key, JSON.stringify(localDataJson));
          } else {
            localDataJson.shift();
            localDataJson.push(data);
            localDataJson.reverse();
            AsyncStorage.setItem(key, JSON.stringify(localDataJson));
          }
        } else {
          //If not, create a new one
          const newLocalData = [];
          newLocalData.push(data);
          AsyncStorage.setItem(key, JSON.stringify(newLocalData));
        }
      }),
      addRecentlySong(song) {
        if (self.recentlySong.get(song.id)) {
          self.recentlySong.get(song.id).update(song);
        } else {
          self.addToLocalStorage(AsyncStorageKey.RECENTLYSEARCH.SONGS, song);
          const newSong = createSongFromJsonApi(song);
          self.recentlySong.put(newSong);
        }
      },
      addRecentlyArtist(artist) {
        if (self.recentlyArtist.get(artist.id)) {
          self.recentlyArtist.get(artist.id).update(artist);
        } else {
          self.addToLocalStorage(
            AsyncStorageKey.RECENTLYSEARCH.ARTISTS,
            artist,
          );
          const newArtist = createArtistFromApiJson(artist);
          self.recentlyArtist.put(newArtist);
        }
      },
      removeRecentlySong(id) {
        self.recentlySong.delete(id);
      },

      removeAllRecently: flow(function* removeAllRecently() {
        yield AsyncStorage.removeItem(AsyncStorageKey.RECENTLYSEARCH.SONGS);
        yield AsyncStorage.removeItem(AsyncStorageKey.RECENTLYSEARCH.ARTISTS);
        yield AsyncStorage.removeItem(AsyncStorageKey.RECENTLYSEARCH.ALBUMS);
        self.recentlySong.clear();
        self.recentlyArtist.clear();
        self.recentlyAlbum.clear();
      }),

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
        const songsJson = JSON.parse(songs);
        songsJson?.length > 0 &&
          songsJson?.forEach(s => {
            const newSong = createSongFromJsonApi(s);
            self.recentlySong.put(newSong);
          });

        const artists = yield AsyncStorage.getItem(
          AsyncStorageKey.RECENTLYSEARCH.ARTISTS,
        );
        const artistsJson = JSON.parse(artists);
        artistsJson?.length > 0 &&
          artistsJson?.forEach(a => {
            const newArtist = createArtistFromApiJson(a);
            self.recentlyArtist.put(newArtist);
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
                  let fullTrack = { ...data, ...res };

                  fullTrack = {
                    ...fullTrack,
                    id: fullTrack.id.toString(),
                    articleId: fullTrack.article ? fullTrack.article.id : 0,
                    artistId: fullTrack.artists[0]?.id ?? 0,
                    artists: fullTrack.artists.map(a => a.name),
                    artwork: '',
                  };
                  fullTrack = createSongFromJsonApi(fullTrack);
                  self.setResultSong(fullTrack);
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
