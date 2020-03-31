import { types, getEnv, flow, getParent } from 'mobx-state-tree';
import { Result } from './result';
import { PlayList, createPlaylistFromApiJson } from '../model/playlist';
import { apiService } from '../context/api_context';
import { Album } from '../model/album';
import { Song } from '../model/song';
import { Alert } from 'react-native';
import { getTrackFullDetail, getPlaylistCover } from '../datasource/api_helper';

export const HomeStore = types
  .model('HomeStore', {
    state: Result,
    recently: types.array(types.reference(Album)),
    popularSongs: types.array(types.reference(Song), []),
    popular: types.array(types.reference(PlayList), []),
    suggesst: types.array(types.reference(PlayList)),
  })
  .actions(self => {
    return {
      // #region Fetch Data Home
      fetchData() {
        self.state = 'loading';
        self.fetchHomeData();
        self.fetchLikedTracks();
        self.fetchLikedArtists();
        self.state = 'success';
      },
      //#endregion

      addPopularSong(song) {
        const songExist = [...self.popularSongs].find(
          popularSong => popularSong.id == song.id,
        );
        if (!songExist) {
          self.popularSongs.push(song.id);
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

      //#region Handle Fect Popular Success
      fetchHomeData: flow(function* fetchHomeData() {
        const homeTrackIds: Array = yield apiService.commonApiService.getHomeTrackIds();
        const homePlaylist: Array = yield apiService.commonApiService.getHomePlaylists();

        //Get full home track info
        if (homeTrackIds?.status == 200) {
          let ids = homeTrackIds?.data.map(ht => ht.id).join(',');

          const homeTracks: Array = yield apiService.commonApiService.getTracks(
            ids,
          );
          if (homeTracks?.status == 200) {
            homeTracks?.data.forEach(async data => {
              let fullTrack = await getTrackFullDetail(data.id);
              fullTrack = { ...data, ...fullTrack };
              if (fullTrack?.track_url) {
                getParent(self).createSongRef(fullTrack);
                self.addPopularSong(fullTrack);
              }
            });
          } else {
            homeTracks?.data ? Alert.alert(homeTracks?.data?.msg) : null;
            // Alert.alert('Có lỗi xảy ra khi tải dữ liệu, vui lòng thử lại.');
          }
        } else {
          homeTrackIds?.data ? Alert.alert(homeTrackIds?.data.msg) : null;
          // Alert.alert('Có lỗi xảy ra khi tải dữ liệu, vui lòng thử lại.');
        }

        if (homePlaylist?.status == 200) {
          homePlaylist?.data.forEach(async data => {
            const playlistInfo = await apiService.trackApiService.getPlaylistInfo(
              data.id,
            );
            if (playlistInfo.status == 200 && playlistInfo.data) {
              const cover = await getPlaylistCover(playlistInfo.data.tracks);
              const playlistFullInfo = { ...playlistInfo.data, ...cover };
              getParent(self).updatePlayList(playlistFullInfo);
              self.addPopular(playlistFullInfo);
            } else {
              playlistInfo?.data ? Alert.alert(playlistInfo?.data.msg) : null;
              // Alert.alert('Có lỗi xảy ra khi tải dữ liệu, vui lòng thử lại.');
            }
          });
        }
      }),
      // #endregion

      fetchLikedTracks: flow(function* fetchLikedTracks() {
        try {
          const likedTracks: Array = yield apiService.commonApiService.getLikedTracks();
          if (likedTracks?.status == 200) {
            const preparedData = likedTracks.data.map(track => track.entity_id);
            getParent(self).setLikedTracks(preparedData);
          } else {
            likedTracks?.data ? Alert.alert(likedTracks.data.msg) : null;
          }
        } catch (err) {
          console.log('err ', err);
        }
      }),

      fetchLikedArtists: flow(function* fetchLikedArtists() {
        try {
          const likedArtists: Array = yield apiService.libraryApiService.getLikedArtists();
          if (likedArtists?.status == 200) {
            const preparedData = likedArtists.data.map(
              artist => artist.entity_id,
            );
            getParent(self).setLikedArtists(preparedData);
          } else {
            likedArtists?.data ? Alert.alert(likedArtists.data.msg) : null;
          }
        } catch (err) {
          console.log('err ', err);
        }
      }),
    };
  });
