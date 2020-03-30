import { types, flow } from 'mobx-state-tree';
import { Result } from '../../../../data/repository/result';
import { apiService } from '../../../../data/context/api_context';
import { Song, createSongFromJsonApi } from '../../../../data/model/song';
// import { getTrackFullDetail } from '../../../../data/datasource/api_helper';

export const AlbumModel = types
  .model('AlbumModel', {
    state: Result,
    songs: types.optional(types.map(Song), {}),
    selectedSong: types.maybeNull(types.reference(Song)),
  })
  .actions(self => {
    return {
      setSongs(track) {
        if (self.songs.get(track.id)) {
          self.songs.get(track.id).update(track);
        } else {
          let song = createSongFromJsonApi(track);
          self.songs.put(song);
        }
      },
      setSelectedSong(song) {
        self.selectedSong = song.id;
      },
      getAlbumTracks: flow(function* getAlbumTracks(ids) {
        const tracks: Array = yield apiService.commonApiService.getTracks(ids);
        if (tracks?.status == 200) {
          tracks?.data?.map(track => {
            self.setSongs(track);
          });
        }
        self.state = 'success';
      }),
    };
  })
  .views(self => {
    return {};
  });
