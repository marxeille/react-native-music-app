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
      //Liked artist
      setLikedPlaylist(playlist) {
        self.likedPlaylist = playlist;
      },
      addLikedAlbum(playlistId) {
        const tmpLikedPlaylist = cloneDeep(self.likedPlaylist);
        tmpLikedPlaylist.push(playlistId);
        self.setLikedPlaylist([...tmpLikedPlaylist]);
      },
      removeLikedAlbum(playlistId) {
        const tmpLikedPlaylist = cloneDeep(self.likedPlaylist);
        remove(tmpLikedPlaylist, p => p == playlistId);
        self.setLikedPlaylist([...tmpLikedPlaylist]);
      },
      getItemDetail: flow(function* getItemDetail(id) {
        const article = yield apiService.commonApiService.getArticleInfo(id);
        if (article.status == 200) {
          rootStore?.updateAlbum(article.data);
        }
      }),
      getLikedPlaylist: flow(function* getLikedPlaylist(id) {
        const likedPlaylists = yield apiService.libraryApiService.getLikedAlbums(
          id,
        );
        if (likedPlaylists.status == 200) {
          const preparedData = likedPlaylists.data.map(
            track => track.entity_id,
          );
          self.setLikedPlaylist(preparedData);
        }
      }),
      getAlbumTracks: flow(function* getAlbumTracks(ids) {
        console.log('ids', ids);

        const tracks: Array = yield apiService.commonApiService.getTracks(ids);

        if (tracks?.status == 200) {
          tracks?.data?.map(async track => {
            let fullTrack = await getTrackFullDetail(track.id);

            fullTrack = { ...track, ...fullTrack };

            fullTrack = {
              ...fullTrack,
              articleId: fullTrack.article ? fullTrack.article.id : 0,
              artistId: fullTrack.artists[0]?.id ?? 0,
              artists: fullTrack.artists.map(a => a.name),
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
