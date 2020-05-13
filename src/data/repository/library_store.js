import { types, flow, getParent } from 'mobx-state-tree';
import { Result } from './result';
import { PlayList } from '../model/playlist';
import { Album } from '../model/album';
import { Artist } from '../model/artist';
import { apiService } from '../context/api_context';
import { getPlaylistCover } from '../datasource/api_helper';
import { findIndex } from 'lodash';
import Toast from 'react-native-simple-toast';

export const LibraryStore = types
  .model('LibraryStore', {
    state: Result,
    albums: types.optional(types.array(types.reference(Album)), []),
    playlists: types.optional(types.array(types.reference(PlayList)), []),
    artists: types.optional(types.array(types.reference(Artist)), []),
  })
  .actions(self => {
    return {
      fetchData() {
        self.state = 'loading';
        self.fetchTabsData();
        self.state = 'success';
      },

      fetchTabsData: flow(function* fetchTabsData() {
        self.fetchPlaylist();
        self.fetchLikedTracksPlaylist();
        self.fetchArtists();
        self.fetchAlbums();
      }),

      setAlbum(album) {
        self.albums.push(album.id);
      },

      updatePlayList(plId) {
        self.playlists.push(plId);
      },

      updateArtist(arId) {
        self.artists.push(arId);
      },
      removePlaylist(playlistId) {
        const plIndex = findIndex(
          [...self.playlists],
          pl => Number(pl.id) == Number(playlistId),
        );
        self.playlists.splice(plIndex, 1);
      },
      removeArtist(artistId) {
        const arIndex = findIndex(
          [...self.artists],
          ar => Number(ar.id) == Number(artistId),
        );
        self.artists.splice(arIndex, 1);
      },

      clearLibraryData() {
        self.albums.length = 0;
        self.playlists.length = 0;
        self.artists.length = 0;
        self.state = 'loading';
      },

      fetchLikedTracksPlaylist() {
        const likedTracks = getParent(self).likedTracks;
        const playlistTracks = likedTracks.map((trackId, i) => {
          return { track_id: trackId, position: i };
        });

        if (likedTracks) {
          const likedTracksPlaylist = {
            id: 0,
            name: 'Bài hát yêu thích',
            private: true,
            artists: [{ name: 'bạn' }],
            tracks:
              likedTracks.length > 0
                ? playlistTracks
                : [{ track_id: '', position: '' }],
            playlistCover: '',
          };

          getParent(self).updatePlayList(likedTracksPlaylist);
          self.updatePlayList(likedTracksPlaylist.id);
        }
      },

      fetchPlaylist: flow(function* fetchPlaylist() {
        try {
          const playlist: Array = yield apiService.libraryApiService.getLikedPlaylists();
          if (playlist.status == 200) {
            const ids = playlist.data.map(pl => pl.entity_id);
            const playlistData: Array = yield apiService.libraryApiService.getPlaylists(
              ids,
            );
            if (playlistData.status == 200) {
              playlistData.data.map(pl => {
                getParent(self).updatePlayList(pl);
                self.updatePlayList(pl.id);
              });
            } else {
              Toast.showWithGravity(
                playlistData.data.msg,
                Toast.LONG,
                Toast.BOTTOM,
              );
            }
          }
        } catch (err) {
          console.log('err ', err);
        }
      }),

      fetchArtists: flow(function* fetchArtists() {
        try {
          const artists: Array = yield apiService.libraryApiService.getLikedArtists();

          if (artists.status == 200) {
            const ids = artists.data.map(artist => artist.entity_id);
            const artistsData: Array = yield apiService.libraryApiService.getArtists(
              ids,
            );
            if (artistsData.status == 200) {
              artistsData.data.map(ar => {
                getParent(self).updateArtist(ar);
                self.updateArtist(ar.id);
              });
            } else {
              Toast.showWithGravity(
                artistsData.data.msg,
                Toast.LONG,
                Toast.BOTTOM,
              );
            }
          }
        } catch (err) {
          console.log('err ', err);
        }
      }),
      fetchAlbums: flow(function* fetchAlbums() {
        try {
          const albums: Array = yield apiService.libraryApiService.getLikedAlbums();

          if (albums.status == 200) {
            const ids = albums.data.map(album => album.entity_id);

            const albumsData: Array = yield apiService.libraryApiService.getAlbums(
              ids,
            );

            if (albumsData.status == 200) {
              albumsData.data.map(async al => {
                let cover = await getPlaylistCover(
                  al?.tracks,
                  al.cover_path !== null,
                );
                if (al.cover_path !== null) {
                  cover = {
                    ...cover,
                    playlistCover: al.cover_path,
                  };
                }
                const albumFullInfo = { ...al, ...cover };
                getParent(self).updateAlbum(albumFullInfo);
                self.setAlbum(al);
              });
            } else {
              Toast.showWithGravity(
                albumsData.data.msg,
                Toast.LONG,
                Toast.BOTTOM,
              );
            }
          }
        } catch (err) {
          console.log('err ', err);
        }
      }),
    };
  });
