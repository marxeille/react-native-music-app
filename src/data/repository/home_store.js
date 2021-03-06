import { types, flow, getParent } from 'mobx-state-tree';
import { Result } from './result';
import { PlayList } from '../model/playlist';
import { apiService } from '../context/api_context';
import { Album } from '../model/album';
import { Song } from '../model/song';
import { getTrackFullDetail, getPlaylistCover } from '../datasource/api_helper';
import { findIndex } from 'lodash';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import { AsyncStorageKey } from '../../constant/constant';

export const HomeStore = types
  .model('HomeStore', {
    state: Result,
    recently: types.array(types.reference(Album)),
    popularSongs: types.array(types.reference(Song), []),
    recentlySongs: types.array(types.reference(Song), []),
    popular: types.array(types.reference(PlayList), []),
    suggesst: types.array(types.reference(PlayList)),
  })
  .actions(self => {
    return {
      // #region Fetch Data Home
      fetchData() {
        self.state = 'loading';
        self.fetchHomeData();
        // self.fetchLikedStuff();
        self.state = 'success';
      },
      //#endregion

      clearHomeData() {
        self.recently.length = 0;
        self.popularSongs.length = 0;
        self.popular.length = 0;
        self.state = 'loading';
      },

      addPopularSong(song) {
        const songExist = [...self.popularSongs].find(
          popularSong => popularSong.id == song.id,
        );
        if (!songExist) {
          self.popularSongs.push(song.id);
        }
      },

      addRecentSong(song) {
        const songExist = [...self.recentlySongs].find(
          rencentlySong => rencentlySong.id == song.id,
        );
        if (!songExist) {
          self.recentlySongs.push(song.id);
        }
      },

      addPopular(playlist) {
        const playlistExist = [...self.popular].find(
          popular => popular.id == playlist.id,
        );
        if (!playlistExist) {
          self.popular.push(playlist.id);
        }
      },

      removePlaylist(playlistId) {
        const plIndex = findIndex(
          [...self.popular],
          pl => Number(pl.id) == Number(playlistId),
        );
        self.popular.splice(plIndex, 1);
      },

      //#region Handle Fect Popular Success
      fetchHomeData: flow(function* fetchHomeData() {
        const homeTrackIds: Array = yield apiService.commonApiService.getHomeTrackIds();
        const rencentTrackIds: Array = yield apiService.commonApiService.getRencentTrackIds();
        const homePlaylist: Array = yield apiService.commonApiService.getHomePlaylists();
        // If there is a song in local storage, set it to current song
        const songPlaying = yield AsyncStorage.getItem(AsyncStorageKey.SONG);
        const songPlayingJson = JSON.parse(songPlaying);

        if (
          songPlayingJson &&
          songPlayingJson !== null &&
          typeof songPlayingJson !== 'undefined' &&
          songPlayingJson.owner_id == getParent(self).userStore.id
        ) {
          getParent(self).createSongRef(songPlayingJson);
          getParent(self).playerStore.setCurrentSong(songPlayingJson.id);
          getParent(self).playerStore.setState('pause');
          getParent(self).playerStore.setTrackIndex(0);
          getParent(self).playerStore.setSelectedId(songPlayingJson.id);
        }

        // if there is local history, get it
        const localHistory = yield AsyncStorage.getItem(
          AsyncStorageKey.HISTORY,
        );
        const localHistoryJson = JSON.parse(localHistory);

        if (localHistoryJson !== null) {
          localHistoryJson.map(history => {
            if (history.owner_id == getParent(self).userStore.id) {
              getParent(self).createSongRef(history);
              getParent(self).historyStore.addSong(history.id);
            }
          });
        }

        //Get full home track info
        if (homeTrackIds?.status == 200) {
          let ids = homeTrackIds?.data.map(ht => ht.id).join(',');

          const likedTracksById: Array = yield apiService.commonApiService.getLikedTracks(
            ids,
          );
          const likedTracks: Array = yield apiService.commonApiService.getLikedTracks();

          if (likedTracksById?.status == 200) {
            const merged = [...likedTracksById.data, ...likedTracks.data];
            const preparedData = merged.map(track => track.entity_id);
            getParent(self).setLikedTracks(preparedData);
          }

          const homeTracks: Array = yield apiService.commonApiService.getTracks(
            ids,
          );

          if (homeTracks?.status == 200) {
            homeTracks?.data.forEach(async data => {
              let fullTrack = await getTrackFullDetail(data.id);

              fullTrack = { ...data, ...fullTrack };

              fullTrack = {
                ...fullTrack,
                articleId:
                  fullTrack.article !== null ? fullTrack.article.id : 0,
                artistId: fullTrack.credit_info[0]?.artist.id ?? 0,
                artists: fullTrack.credit_info.map(a => a.artist.name),
              };

              if (fullTrack?.track_url) {
                getParent(self).createSongRef(fullTrack);
                self.addPopularSong(fullTrack);
              }
            });
          } else {
            homeTracks?.data
              ? Toast.showWithGravity(
                  homeTracks?.data?.msg,
                  Toast.LONG,
                  Toast.BOTTOM,
                )
              : null;
          }
        } else {
          homeTrackIds?.data
            ? Toast.showWithGravity(
                homeTrackIds?.data.msg,
                Toast.LONG,
                Toast.BOTTOM,
              )
            : null;
        }

        // Get rencently tracks

        if (rencentTrackIds?.status == 200) {
          const rencentIds = rencentTrackIds?.data.map(rt => rt.id).join(',');
          const recentTracks: Array = yield apiService.commonApiService.getTracks(
            rencentIds,
          );

          if (recentTracks?.status == 200) {
            recentTracks?.data.forEach(async data => {
              let fullTrack = await getTrackFullDetail(data.id);

              fullTrack = { ...data, ...fullTrack };

              fullTrack = {
                ...fullTrack,
                articleId:
                  fullTrack.article !== null ? fullTrack.article.id : 0,
                artistId: fullTrack.credit_info[0]?.artist.id ?? 0,
                artists: fullTrack.credit_info.map(a => a.artist.name),
              };

              if (fullTrack?.track_url) {
                getParent(self).createSongRef(fullTrack);
                self.addRecentSong(fullTrack);
              }
            });
          } else {
            recentTracks?.data
              ? Toast.showWithGravity(
                  recentTracks?.data?.msg,
                  Toast.LONG,
                  Toast.BOTTOM,
                )
              : null;
          }
        } else {
          rencentTrackIds?.data
            ? Toast.showWithGravity(
                rencentTrackIds?.data.msg,
                Toast.LONG,
                Toast.BOTTOM,
              )
            : null;
        }

        if (homePlaylist?.status == 200) {
          homePlaylist?.data.forEach(async data => {
            const playlistInfo = await apiService.trackApiService.getPlaylistInfo(
              data.id,
            );

            if (playlistInfo.status == 200 && playlistInfo.data) {
              // let cover;
              // cover = await getPlaylistCover(
              //   playlistInfo?.data?.tracks,
              //   playlistInfo.data.cover_path !== null,
              // );
              // if (playlistInfo.data.cover_path !== null) {
              //   cover = {
              //     ...cover,
              //     playlistCover: playlistInfo.data.cover_path,
              //   };
              // }
              const cover = await apiService.commonApiService.getUserInfoById(
                playlistInfo.data.owner_id,
              );
              let coverInfo = {};
              if (cover.status == 200) {
                coverInfo = {
                  ...coverInfo,
                  owner: cover.data.fullname,
                  playlistCover: playlistInfo.data.cover_path,
                };
              }
              const playlistFullInfo = { ...playlistInfo.data, ...coverInfo };
              getParent(self).updatePlayList(playlistFullInfo);
              self.addPopular(playlistFullInfo);
            } else {
              playlistInfo?.data
                ? Toast.showWithGravity(
                    playlistInfo?.data.msg,
                    Toast.LONG,
                    Toast.BOTTOM,
                  )
                : null;
            }
          });
        }
      }),
      // #endregion

      //Add tracks to playlist
      addTracksToPlaylist: flow(function* addTracksToPlaylist(playlist) {
        try {
          const newPlaylist = yield apiService.trackApiService.editPlaylist(
            playlist,
          );

          if (newPlaylist?.status == 200) {
            getParent(self).updatePlayList(newPlaylist.data);
            Toast.showWithGravity('Thêm thành công', Toast.LONG, Toast.BOTTOM);
          }
        } catch (err) {
          console.log('err ', err);
        }
      }),
    };
  });
