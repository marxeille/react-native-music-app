import { types } from 'mobx-state-tree';
import { Result } from './result';
import { Song } from '../model/song';
import { indexOf, map, remove, cloneDeep } from 'lodash';

const SongOfHistoryStore = types
  .model('SongOfQueueStore', {
    id: types.maybeNull(types.string),
    state: types.maybeNull(Result),
    queueIndex: types.optional(types.number, 0),
    songs: types.optional(types.array(types.reference(Song)), []),
  })
  .actions(self => {
    return {
      addSongs(songs) {
        songs.map(song => {
          self.addSong(song.id);
        });
      },

      clearHistory() {
        self.songs.clear();
      },

      addSong(id) {
        if (indexOf(map([...self.songs], 'id'), id) < 0) {
          self.songs.push(id);
        }
      },

      addNewQue(songs) {
        self.songs = [];
        songs.map(song => {
          self.addSong(song.id);
        });
      },

      removeSongs(songIds) {
        let songs = cloneDeep(self.songs);
        remove(songs, song => {
          return indexOf(songIds, song.id) >= 0;
        });
        self.addNewQue(songs);
      },
    };
  })
  .views(self => {
    return {
      getSongs() {
        return self.songs.map(data => {
          return data.getDataJson();
        });
      },
    };
  });

export default SongOfHistoryStore;
