import { types, flow } from 'mobx-state-tree';
import { Result } from '../../../../data/repository/result';
import { apiService } from '../../../../data/context/api_context';
import { Song, createSongFromJsonApi } from '../../../../data/model/song';
import { getTrackFullDetail } from '../../../../data/datasource/api_helper';

export const ArtistModel = types
  .model('ArtistModel', {
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
      getArtistTracks: flow(function* getArtistTracks(id) {
        const artistTrackIds: Array = yield apiService.libraryApiService.getArtistTracks(
          id,
        );
        if (artistTrackIds?.status == 200) {
          const ids = artistTrackIds?.data.map(track => track.track_id);
          const tracks: Array = yield apiService.commonApiService.getTracks(
            ids,
          );
          if (tracks?.status == 200) {
            tracks?.data?.map(track => {
              self.setSongs(track);
            });
          }
        }
        self.state = 'success';
      }),
    };
  })
  .views(self => {
    return {};
  });
