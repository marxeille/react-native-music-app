import { types, flow } from 'mobx-state-tree';
import { Result } from '../../../../data/repository/result';
import { apiService } from '../../../../data/context/api_context';
import { Song, createSongFromJsonApi } from '../../../../data/model/song';
import { rootStore } from '../../../../data/context/root_context';
import { getTrackFullDetail } from '../../../../data/datasource/api_helper';
import { remove, cloneDeep } from 'lodash';

export const AlbumModel = types
  .model('AlbumModel', {
    state: Result,
    songs: types.optional(types.map(Song), {}),
    selectedSong: types.maybeNull(types.reference(Song)),
    stats: types.number,
    likedPlaylist: types.array(types.number),
    likedAlbum: types.array(types.number),
    likedTracks: types.array(types.number),
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

      setStats(stats) {
        self.stats = stats;
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
      //Liked playlist
      setLikedPlaylist(playlist) {
        self.likedPlaylist = playlist;
      },
      addLikedPlaylist(playlistId) {
        const tmpLikedPlaylist = cloneDeep(self.likedPlaylist);
        tmpLikedPlaylist.push(playlistId);
        self.setLikedPlaylist([...tmpLikedPlaylist]);
      },
      removeLikedPlaylist(playlistId) {
        const tmpLikedPlaylist = cloneDeep(self.likedPlaylist);
        remove(tmpLikedPlaylist, p => p == playlistId);
        self.setLikedPlaylist([...tmpLikedPlaylist]);
      },
      //Liked album
      setLikedAlbum(album) {
        self.likedAlbum = album;
      },
      addLikedAlbum(playlistId) {
        const tmpLikedPlaylist = cloneDeep(self.likedAlbum);
        tmpLikedPlaylist.push(playlistId);
        self.setLikedAlbum([...tmpLikedPlaylist]);
      },
      removeLikedAlbum(playlistId) {
        const tmpLikedPlaylist = cloneDeep(self.likedAlbum);
        remove(tmpLikedPlaylist, p => p == playlistId);
        self.setLikedAlbum([...tmpLikedPlaylist]);
      },
      getItemDetail: flow(function* getItemDetail(id) {
        const article = yield apiService.commonApiService.getArticleInfo(id);

        if (article.status == 200) {
          rootStore?.updateAlbum(article.data);
        } else {
          const playlist = yield apiService.trackApiService.getPlaylistInfo(id);
          if (playlist.status == 200) {
            rootStore?.updatePlayList(playlist.data);
          }
        }
      }),
      getLikedPlaylist: flow(function* getLikedPlaylist(id) {
        const likedPlaylists = yield apiService.libraryApiService.getLikedPlaylists(
          id,
        );
        const likedAlbums = yield apiService.libraryApiService.getLikedAlbums(
          id,
        );

        if (likedPlaylists.status == 200) {
          if (likedPlaylists.data.length > 0) {
            self.likedPlaylist.push(likedPlaylists.data[0].entity_id);
          }
        }

        if (likedAlbums.status == 200) {
          if (likedAlbums.data.length > 0) {
            self.likedAlbum.push(likedAlbums.data[0].entity_id);
          }
        }
      }),
      getAlbumTracks: flow(function* getAlbumTracks(ids) {
        const tracks: Array = yield apiService.commonApiService.getTracks(ids);
        const likedTracks = yield apiService.commonApiService.getLikedTracks(
          ids,
        );

        if (likedTracks?.status == 200) {
          const preparedTrackData = likedTracks.data.map(
            track => track.entity_id,
          );
          self.setLikedTracks(preparedTrackData);
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
      getStats: flow(function* getStats(type, id) {
        const stats: Array = yield apiService.commonApiService.getStats(
          type,
          id,
        );
        if (stats?.status == 200) {
          self.setStats(stats.data.count);
        }
      }),
    };
  })
  .views(self => {
    return {};
  });
