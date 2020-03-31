import { UserStore } from './user_store';
import { PlayerStore } from './player_store';
import { HomeStore } from './home_store';

import { types, flow } from 'mobx-state-tree';
import { PlayList, createPlaylistFromApiJson } from '../model/playlist';
import { Artist, createArtistFromApiJson } from '../model/artist';
import { apiService } from '../context/api_context';
import { Song, createSongFromJson, createSongFromJsonApi } from '../model/song';
import { Album } from '../model/album';
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
    songs: types.maybeNull(types.map(Song)),
    albums: types.maybeNull(types.map(Album)),
    likedTracks: types.array(types.number),
  })
  .actions(self => {
    return {
      updatePlayList(playlistJson) {
        if (self.playlist.get(playlistJson.id)) {
          self.playlist.get(playlistJson.id).update(playlistJson);
        } else {
          const playList = createPlaylistFromApiJson(playlistJson);
          self.playlist.put(playList);
        }
      },

      updateArtist(artistJson) {
        if (self.artist !== null && self.artist.get(artistJson.id)) {
          self.artist.get(artistJson.id).update(artistJson);
        } else {
          const artist = createArtistFromApiJson(artistJson);
          self.artist.put(artist);
        }
      },

      updateSongs(values: Array) {
        values.forEach(data => {
          self.songs.put(createSongFromJson(data));
        });
      },

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

      createSongRef(song) {
        if (self.songs.get(song.id)) {
          self.songs.get(song.id).update(song);
        } else {
          const newSong = createSongFromJsonApi(song);
          self.songs.put(newSong);
        }
      },

      updateAlbums(values: Array) {
        values.forEach(data => {
          self.songs.put(data);
        });
      },

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
    };
  });
