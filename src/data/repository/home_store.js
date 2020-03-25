import { types, getEnv, flow, getParent } from 'mobx-state-tree';
import { Result } from './result';
import { PlayList, createPlaylistFromJson } from '../model/playlist';
import { apiService } from '../context/api_context';
import { Album } from '../model/album';
import { Song } from '../model/song';
import { Alert } from 'react-native';

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
      //#region Handle Fect Popular Success
      fetchHomeData: flow(function* fetchHomeData() {
        const playlist: Array = yield apiService.commonApiService.getPopularPlayList();
        const homeTracks: Array = yield apiService.commonApiService.getHomeTracks();
        const homePlaylist: Array = yield apiService.commonApiService.getHomePlaylists();
        console.log('playlist', homeTracks, homePlaylist);

        playlist.forEach(data => {
          self.popular.push(data.id);
          getParent(self).updatePlayList(data);
        });

        if (homeTracks.status == 200) {
          homeTracks.data.forEach(async data => {
            const [trackInfo, trackUrl, trackArtist] = await Promise.all([
              new Promise(async resolve => {
                try {
                  const result = await apiService.trackApiService.getTrackInfo(
                    data.id,
                  );
                  resolve(result?.data || null);
                } catch (error) {
                  resolve(null);
                }
              }),
              new Promise(async resolve => {
                try {
                  const result = await apiService.trackApiService.getTrackUrl(
                    data.id,
                  );
                  resolve(result?.data || null);
                } catch (error) {
                  reject();
                }
              }),
              new Promise(async resolve => {
                try {
                  const result = await apiService.trackApiService.getTrackArtistInfo(
                    data.id,
                  );
                  resolve(result?.data || null);
                } catch (error) {
                  resolve(null);
                }
              }),
            ]);

            console.log('full track', {
              ...trackInfo,
              ...trackUrl,
              ...trackArtist,
            });

            // self.popularSongs.push(data.id);
            // getParent(self).createSongRef(data);
          });
        } else {
          Alert.alert('Có lỗi xảy ra khi tải dữ liệu, vui lòng thử lại.');
        }

        self.state = 'success';
      }),
      // #endregion
    };
  });
