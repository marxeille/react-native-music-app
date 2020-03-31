import { UserStore } from './user_store';
import { PlayerStore } from './player_store';
import { HomeStore } from './home_store';

import { types, flow } from 'mobx-state-tree';
import { PlayList, createPlaylistFromApiJson } from '../model/playlist';
import { Artist, createArtistFromApiJson } from '../model/artist';
import { Album, createAlbumFromApiJson } from '../model/album';
import { Song, createSongFromJson, createSongFromJsonApi } from '../model/song';
import SongOfQueueStore from './song_of_queue_store';
import { LibraryStore } from './library_store';
import { remove, cloneDeep } from 'lodash';

export const RootStore = types
  .model('RootStore', {
    userStore: UserStore,
    playerStore: PlayerStore,
    homeStore: HomeStore,
    libraryStore: LibraryStore,
    queueStore: SongOfQueueStore,
    playlist: types.maybeNull(types.map(PlayList)),
    artist: types.maybeNull(types.map(Artist)),
    albums: types.maybeNull(types.map(Album)),
    songs: types.maybeNull(types.map(Song)),
    likedTracks: types.array(types.number),
    likedArtists: types.array(types.number),
  })
  .actions(self => {
    return {
      //Create playlist reference(for global access)
      updatePlayList(playlistJson) {
        if (self.playlist.get(playlistJson.id)) {
          self.playlist.get(playlistJson.id).update(playlistJson);
        } else {
          const playList = createPlaylistFromApiJson(playlistJson);
          self.playlist.put(playList);
        }
      },
      //Create aritst reference(for global access)
      updateArtist(artistJson) {
        if (self.artist !== null && self.artist.get(artistJson.id)) {
          self.artist.get(artistJson.id).update(artistJson);
        } else {
          const artist = createArtistFromApiJson(artistJson);
          self.artist.put(artist);
        }
      },
      //Create album reference(for global access)
      updateAlbum(albumJson) {
        if (self.albums !== null && self.albums.get(albumJson.id)) {
          self.albums.get(albumJson.id).update(albumJson);
        } else {
          const album = createAlbumFromApiJson(albumJson);
          self.albums.put(album);
        }
      },
      // Make a new songs
      updateSongs(values: Array) {
        values.forEach(data => {
          self.songs.put(createSongFromJson(data));
        });
      },
      // Update whole song list
      replaceSongs(songs: Array) {
        songs.forEach(data => {
          if (self.songs.get(data.id)) {
            self.songs.get(data.id).update(data);
          } else {
            let song = createSongFromJson(data);
            self.songs.put(song);
          }
        });
      },

      //Create song reference
      createSongRef(song) {
        if (self.songs.get(song.id)) {
          self.songs.get(song.id).update(song);
        } else {
          const newSong = createSongFromJsonApi(song);
          self.songs.put(newSong);
        }
      },

      //Create albums for rootStore
      updateAlbums(values: Array) {
        values.forEach(data => {
          self.songs.put(data);
        });
      },

      // Tracks reaction
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

      // Artists reaction
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
      //
    };
  });
