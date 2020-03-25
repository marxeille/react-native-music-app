import { UserStore } from './user_store';
import { PlayerStore } from './player_store';
import { HomeStore } from './home_store';

import { types, flow } from 'mobx-state-tree';
import { PlayList, createPlaylistFromJson } from '../model/playlist';
import { apiService } from '../context/api_context';
import { Song, createSongFromJson } from '../model/song';
import { Album } from '../model/album';
import SongOfQueueStore from './song_of_queue_store';
import { LibraryStore } from './library_store';

export const RootStore = types
  .model('RootStore', {
    userStore: UserStore,
    playerStore: PlayerStore,
    homeStore: HomeStore,
    libraryStore: LibraryStore,
    queueStore: SongOfQueueStore,
    playlist: types.maybeNull(types.map(PlayList)),
    songs: types.maybeNull(types.map(Song)),
    albums: types.maybeNull(types.map(Album)),
  })
  .actions(self => {
    return {
      updatePlayList(playlistJson) {
        if (self.playlist.get(playlistJson.id)) {
          self.playlist.get(playlistJson.id).update(playlistJson);
        } else {
          let playList = createPlaylistFromJson(playlistJson);
          self.playlist.put(playList);
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
          let newSong = createSongFromJson(song);
          self.songs.put(newSong);
        }
      },

      updateAlbums(values: Array) {
        values.forEach(data => {
          self.songs.put(data);
        });
      },
    };
  });
