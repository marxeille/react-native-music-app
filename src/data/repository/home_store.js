import { types, getEnv, flow, getParent } from 'mobx-state-tree';
import { Result } from './result';
import { PlayList, createPlaylistFromApiJson } from '../model/playlist';
import { apiService } from '../context/api_context';
import { Album } from '../model/album';
import { Song } from '../model/song';
import { Alert } from 'react-native';
import { getTrackFullDetail, getPlaylistCover } from '../datasource/api_helper';
import { indexOf } from 'lodash';

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
        const homeTracks: Array = yield apiService.commonApiService.getHomeTracks();
        const homePlaylist: Array = yield apiService.commonApiService.getHomePlaylists();

        //Get full home track info
        if (homeTracks.status == 200) {
          homeTracks.data.forEach(async data => {
            const fullTrack = await getTrackFullDetail(data.id);
            if (fullTrack?.track_url) {
              getParent(self).createSongRef(fullTrack);
              self.addPopularSong(fullTrack);
            }
          });
        } else {
          Alert.alert('Có lỗi xảy ra khi tải dữ liệu, vui lòng thử lại.');
        }

        if (homePlaylist.status == 200) {
          homePlaylist.data.forEach(async data => {
            const playlistInfo = await apiService.trackApiService.getPlaylistInfo(
              data.id,
            );
            if (playlistInfo.status == 200 && playlistInfo.data) {
              const cover = await getPlaylistCover(playlistInfo.data.tracks);
              const playlistFullInfo = { ...playlistInfo.data, ...cover };
              getParent(self).updatePlayList(playlistFullInfo);
              self.addPopular(playlistFullInfo);
            }
          });
        }

        self.state = 'success';
      }),
      // #endregion
    };
  });
