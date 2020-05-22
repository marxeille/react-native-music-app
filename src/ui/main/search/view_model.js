import AsyncStorage from '@react-native-community/async-storage';
import { types, flow } from 'mobx-state-tree';
import { Result } from '../../../data/repository/result';
import { Song, createSongFromJsonApi } from '../../../data/model/song';
import { apiService } from '../../../data/context/api_context';
import { Artist, createArtistFromApiJson } from '../../../data/model/artist';
import { getTrackFullDetail } from '../../../data/datasource/api_helper';
import { AsyncStorageKey } from '../../../constant/constant';
import { remove } from 'lodash';
import {
  PlayList,
  createPlaylistFromApiJson,
} from '../../../data/model/playlist';
import Toast from 'react-native-simple-toast';

export const SearchModel = types
  .model('SearchModel', {
    state: Result,
    recentlyKeyWord: types.maybeNull(types.array(types.string)),
    recentlySong: types.optional(types.map(Song), {}),
    recentlyPlaylist: types.optional(types.map(PlayList), {}),
    recentlyArtist: types.optional(types.map(Artist), {}),
    recentlyOrder: types.optional(types.array(types.string), []),
    keyword: types.maybeNull(types.string),
    resultSongs: types.optional(types.map(Song), {}),
    resultPlaylists: types.optional(types.map(PlayList), {}),
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

      addRecentlySearch(item) {
        switch (item.getType()) {
          case 'song':
            // code block song
            if (self.recentlySong.get(item.id)) {
              self.recentlySong.get(item.id).update(item);
            } else {
              self.addToLocalStorage(AsyncStorageKey.RECENTLYSEARCH.ALL, item);
              const newSong = createSongFromJsonApi(item);
              self.recentlySong.put(newSong);
            }
            break;
          case 'playlist':
            // code block playlist
            item = { ...item, tracks: [] };
            if (self.recentlyPlaylist.get(item.id)) {
              self.recentlyPlaylist.get(item.id).update(item);
            } else {
              self.addToLocalStorage(AsyncStorageKey.RECENTLYSEARCH.ALL, item);
              const newPl = createPlaylistFromApiJson(item);
              // self.resultPlaylists.put(newPl);
              self.recentlyPlaylist.put(newPl);
            }
            break;
          default:
            // code block artist
            if (self.recentlyArtist.get(item.id)) {
              self.recentlyArtist.get(item.id).update(item);
            } else {
              self.addToLocalStorage(AsyncStorageKey.RECENTLYSEARCH.ALL, item);
              const newArtist = createArtistFromApiJson(item);
              self.recentlyArtist.put(newArtist);
            }
        }
        self.recentlyOrder.shift(item.id);
      },

      removeRecentlySong(id) {
        self.recentlySong.delete(id);
      },

      removeModelData(type, id) {
        if (type == 'song') {
          self.recentlySong.delete(id);
        } else if (type == 'artist') {
          self.recentlyArtist.delete(id);
        } else {
          self.recentlyPlaylist.delete(id);
        }
      },

      removeLocalData: flow(function* removeLocalData(type, id) {
        const localData = yield AsyncStorage.getItem(
          AsyncStorageKey.RECENTLYSEARCH.ALL,
        );
        let localDataJson = JSON.parse(localData);
        remove(localDataJson, item => Number(item.id) == Number(id));
        self.removeModelData(type, id);
        AsyncStorage.setItem(
          AsyncStorageKey.RECENTLYSEARCH.ALL,
          JSON.stringify(localDataJson),
        );
      }),

      removeAllRecently: flow(function* removeAllRecently() {
        yield AsyncStorage.removeItem(AsyncStorageKey.RECENTLYSEARCH.ALL);
        self.recentlySong.clear();
        self.recentlyArtist.clear();
        self.recentlyPlaylist.clear();
        self.recentlyOrder.length = 0;
      }),

      removeAllSearchResult() {
        self.resultSongs.clear();
        self.resultPlaylists.clear();
        self.resultArtists.clear();
      },

      setRencentlyOrder(order) {
        self.recentlyOrder = order;
      },

      setResultSong(song) {
        self.resultSongs.put(song);
      },

      setResultArtist(artist) {
        self.resultArtists.put(artist);
      },

      setResultPlaylist(playlist) {
        self.resultPlaylists.put(playlist);
      },

      getRecentlyResult: flow(function* getRecentlyResult() {
        const results = yield AsyncStorage.getItem(
          AsyncStorageKey.RECENTLYSEARCH.ALL,
        );
        const order = [];

        const resultsJson = JSON.parse(results);
        resultsJson?.length > 0 &&
          resultsJson?.forEach(r => {
            order.push(r.id);
            if (r.type == 'song') {
              const newSong = createSongFromJsonApi(r);
              self.recentlySong.put(newSong);
            } else if (r.type == 'playlist') {
              const newPl = createPlaylistFromApiJson(r);
              self.recentlyPlaylist.put(newPl);
            } else {
              const newArtist = createArtistFromApiJson(r);
              self.recentlyArtist.put(newArtist);
            }
          });

        self.setRencentlyOrder(order);

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
              result.data.hits.tracks.forEach(async data => {
                const trackDetail = await apiService.trackApiService.getTrackInfo(
                  data.id,
                );
                getTrackFullDetail(data.id).then(res => {
                  let fullTrack = { ...trackDetail.data, ...res };
                  fullTrack = {
                    ...fullTrack,
                    id: fullTrack.id.toString(),
                    articleId: fullTrack.article ? fullTrack.article.id : 0,
                    artistId: fullTrack.credit_info[0]?.artist.id ?? 0,
                    artists: fullTrack.credit_info.map(a => a.artist.name),
                    artwork: '',
                  };

                  fullTrack = createSongFromJsonApi(fullTrack);
                  self.setResultSong(fullTrack);
                });
              });
            }
            if (result.data.hits.artists.length > 0) {
              const ids = result.data.hits.artists.map(a => a.id);
              const artistsData: Array = yield apiService.libraryApiService.getArtists(
                ids,
              );
              if (artistsData.status == 200) {
                artistsData.data.map(ar => {
                  const artist = createArtistFromApiJson(ar);
                  self.setResultArtist(artist);
                });
              } else {
                Toast.showWithGravity(
                  artistsData.data.msg,
                  Toast.LONG,
                  Toast.BOTTOM,
                );
              }
            }
            if (result.data.hits.playlists.length > 0) {
              const ids = result.data.hits.playlists.map(p => p.id);
              const playlistData: Array = yield apiService.libraryApiService.getPlaylists(
                ids,
              );
              if (playlistData.status == 200) {
                playlistData.data.map(pl => {
                  const playlist = createPlaylistFromApiJson(pl);
                  self.setResultPlaylist(playlist);
                });
              } else {
                Toast.showWithGravity(
                  playlistData.data.msg,
                  Toast.LONG,
                  Toast.BOTTOM,
                );
              }
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
