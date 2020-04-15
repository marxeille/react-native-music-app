import { Alert } from 'react-native';
import { types, flow, getParent } from 'mobx-state-tree';
import { Result } from './result';
import { PlayList } from '../model/playlist';
import { Album } from '../model/album';
import { Artist } from '../model/artist';
import { apiService } from '../context/api_context';
import { getPlaylistCover } from '../datasource/api_helper';

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
      },

      fetchTabsData: flow(function* fetchTabsData() {
        self.fetchPlaylist();
        self.fetchLikedTracksPlaylist();
        self.fetchArtists();
        self.fetchAlbums();
        self.state = 'success';
      }),

      setAlbum(album) {
        self.albums.push(album.id);
      },

      updatePlayList(pl) {
        self.playlists.push(pl.id);
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
            private: null,
            artists: [{ name: 'bạn' }],
            tracks:
              likedTracks.length > 0
                ? playlistTracks
                : [{ track_id: '', position: '' }],
            playlistCover: null,
          };

          getParent(self).updatePlayList(likedTracksPlaylist);
          self.playlists.push(likedTracksPlaylist.id);
        }
      },

      fetchPlaylist: flow(function* fetchPlaylist() {
        try {
          const playlist: Array = yield apiService.commonApiService.getPlaylists();
          if (playlist.status == 200) {
            playlist.data.map(pl => {
              getParent(self).updatePlayList(pl);
              self.playlists.push(pl.id);
            });
          } else {
            Alert.alert(playlist.data.msg);
          }
        } catch (err) {
          console.log('err ', err);
        }
      }),

      fetchArtists: flow(function* fetchArtists() {
        try {
          const artists: Array = yield apiService.libraryApiService.getArtists();
          if (artists.status == 200) {
            artists.data.map(ar => {
              getParent(self).updateArtist(ar);
              self.artists.push(ar.id);
            });
          } else {
            Alert.alert(artists.data.msg);
          }
        } catch (err) {
          console.log('err ', err);
        }
      }),
      fetchAlbums: flow(function* fetchAlbums() {
        try {
          const albums: Array = yield apiService.libraryApiService.getAlbums();
          if (albums.status == 200) {
            albums.data.map(async al => {
              const cover = await getPlaylistCover(al?.tracks);
              const albumFullInfo = { ...al, ...cover };
              getParent(self).updateAlbum(albumFullInfo);
              self.setAlbum(al);
            });
          } else {
            Alert.alert(albums.data.msg);
          }
        } catch (err) {
          console.log('err ', err);
        }
      }),
    };
  });
