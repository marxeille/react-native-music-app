import { types, flow } from 'mobx-state-tree';
import { Result } from './result';
import { Song } from '../model/song';
import { indexOf, map, remove, cloneDeep } from 'lodash';

const SongOfQueueStore = types
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
          self.addSong(song);
        });
      },

      addSong(song) {
        if (indexOf(map([...self.songs], 'id'), song.id) < 0) {
          self.songs.push(song.id);
        }
      },

      addNewQue(songs) {
        self.songs = [];
        songs.map(song => {
          self.addSong(song);
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

export default SongOfQueueStore;
