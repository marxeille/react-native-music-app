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

      updateAlbums(values: Array) {
        values.forEach(data => {
          self.songs.put(data);
        });
      },
    };
  });
