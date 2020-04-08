import { types, flow } from 'mobx-state-tree';
import { Result } from '../../../../data/repository/result';
import { apiService } from '../../../../data/context/api_context';
import { Song, createSongFromJsonApi } from '../../../../data/model/song';
import { rootStore } from '../../../../data/context/root_context';
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
      getItemDetail: flow(function* getItemDetail(id) {
        const artist = yield apiService.trackApiService.getArtistInfo(id);

        if (artist.status == 200) {
          rootStore?.updateArtist(artist.data);
        }
      }),
      getArtistTrackIds: flow(function* getArtistTracks(id) {
        const artistTrackIds: Array = yield apiService.libraryApiService.getArtistTracks(
          id,
        );
        let ids = [];
        if (artistTrackIds?.status == 200) {
          ids = artistTrackIds?.data.map(track => track.track_id);
        }
        return ids;
      }),
      getArtistTracks: flow(function* getArtistTracks(id) {
        const ids = yield self.getArtistTrackIds(id);
        const tracks: Array = yield apiService.commonApiService.getTracks(ids);
        if (tracks?.status == 200) {
          tracks?.data?.map(async track => {
            let fullTrack = await getTrackFullDetail(track.id);
            fullTrack = { ...track, ...fullTrack };
            fullTrack = {
              ...fullTrack,
              articleId: fullTrack.article.id,
              artistId: fullTrack.artists[0]?.id ?? 0,
              artists: fullTrack.artists.map(a => a.name),
            };
            self.setSongs(fullTrack);
          });
        }
        self.state = 'success';
      }),
    };
  })
  .views(self => {
    return {};
  });
