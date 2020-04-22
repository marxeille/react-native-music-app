import { types, flow } from 'mobx-state-tree';
import { Result } from '../../../../data/repository/result';
import { apiService } from '../../../../data/context/api_context';
import { Song, createSongFromJsonApi } from '../../../../data/model/song';
import { rootStore } from '../../../../data/context/root_context';
import { getTrackFullDetail } from '../../../../data/datasource/api_helper';
import { remove, cloneDeep } from 'lodash';

export const ArtistModel = types
  .model('ArtistModel', {
    state: Result,
    songs: types.optional(types.map(Song), {}),
    selectedSong: types.maybeNull(types.reference(Song)),
    likedTracks: types.array(types.number),
    likedArtists: types.array(types.number),
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
      //Liked tracks
      setLikedTracks(tracks) {
        self.likedTracks = tracks;
      },
      addLikedTrack(trackId) {
        const tmpLikedTracks = cloneDeep(self.likedTracks);
        tmpLikedTracks.push(trackId);
        self.setLikedTracks([...tmpLikedTracks]);
      },
      removeLikedTrack(trackId) {
        const tmpLikedTracks = cloneDeep(self.likedTracks);
        remove(tmpLikedTracks, track => track == trackId);
        self.setLikedTracks([...tmpLikedTracks]);
      },
      //Liked artist
      setLikedArtists(artists) {
        self.likedArtists = artists;
      },
      addLikedArtist(artistId) {
        const tmpLikedArtists = cloneDeep(self.likedArtists);
        tmpLikedArtists.push(artistId);
        self.setLikedArtists([...tmpLikedArtists]);
      },
      removeLikedArtist(artistId) {
        const tmpLikedArtists = cloneDeep(self.likedArtists);
        remove(tmpLikedArtists, a => a == artistId);
        self.setLikedArtists([...tmpLikedArtists]);
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
        const likedTracks = yield apiService.commonApiService.getLikedTracks(
          ids,
        );
        const likedArtists = yield apiService.libraryApiService.getLikedArtists(
          id,
        );

        if (likedTracks?.status == 200) {
          const preparedTrackData = likedTracks.data.map(
            track => track.entity_id,
          );
          self.setLikedTracks(preparedTrackData);
        }
        if (likedArtists?.status == 200) {
          const preparedArtistsData = likedArtists.data.map(
            track => track.entity_id,
          );

          self.setLikedArtists(preparedArtistsData);
        }
        if (tracks?.status == 200) {
          tracks?.data?.map(async track => {
            let fullTrack = await getTrackFullDetail(track.id);

            fullTrack = { ...track, ...fullTrack };
            fullTrack = {
              ...fullTrack,
              articleId: fullTrack.article ? fullTrack.article.id : 0,
              artistId: fullTrack.credit_info[0]?.artist.id ?? 0,
              artists: fullTrack.credit_info.map(a => a.artist.name),
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
