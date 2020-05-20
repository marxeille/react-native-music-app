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
    recentlyPlaylist: types.optional(
      types.array(types.reference(PlayList)),
      [],
    ),
    recentlyArtist: types.optional(types.map(Artist), {}),
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
      addRecentlyPlaylist(playlist) {
        if (self.resultPlaylists.get(playlist.id)) {
          self.resultPlaylists.get(playlist.id).update(playlist);
        } else {
          self.addToLocalStorage(
            AsyncStorageKey.RECENTLYSEARCH.PLAYLISTS,
            playlist,
          );
          const newPl = createPlaylistFromApiJson(playlist);
          self.resultPlaylists.put(newPl);
          self.recentlyPlaylist.push(newPl.id);
        }
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
        const key =
          type == 'song'
            ? AsyncStorageKey.RECENTLYSEARCH.SONGS
            : type == 'artist'
            ? AsyncStorageKey.RECENTLYSEARCH.ARTISTS
            : AsyncStorageKey.RECENTLYSEARCH.PLAYLISTS;
        const localData = yield AsyncStorage.getItem(key);
        const localDataJson = JSON.parse(localData);
        remove(localDataJson, data => data.id == id);
        AsyncStorage.setItem(key, JSON.stringify(localDataJson));
        self.removeModelData(type, id);
      }),

      removeAllRecently: flow(function* removeAllRecently() {
        yield AsyncStorage.removeItem(AsyncStorageKey.RECENTLYSEARCH.SONGS);
        yield AsyncStorage.removeItem(AsyncStorageKey.RECENTLYSEARCH.ARTISTS);
        yield AsyncStorage.removeItem(AsyncStorageKey.RECENTLYSEARCH.PLAYLISTS);
        self.recentlySong.clear();
        self.recentlyArtist.clear();
        self.recentlyPlaylist.clear();
      }),

      removeAllSearchResult() {
        self.resultSongs.clear();
        self.resultPlaylists.clear();
        self.resultArtists.clear();
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

        const playlists = yield AsyncStorage.getItem(
          AsyncStorageKey.RECENTLYSEARCH.PLAYLISTS,
        );
        console.log('playlists', playlists);

        const playlistsJson = JSON.parse(playlists);
        playlistsJson?.length > 0 &&
          playlistsJson?.forEach(pl => {
            self.addRecentlyPlaylist(pl);
          });

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
                  let artist = createArtistFromApiJson(ar);
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
                  let playlist = createPlaylistFromApiJson(pl);
                  self.setResultPlaylist(playlist);
                  console.log('playlist', playlist);
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
