import { types, flow } from 'mobx-state-tree';
import { Result } from './result';
import { Song } from '../model/song';

const SongOfQueueStore = types
  .model('SongOfQueueStore', {
    id: types.maybeNull(types.string),
    state: types.maybeNull(Result),
    songs: types.maybeNull(types.array(types.reference(Song))),
  })
  .actions(self => {
    return {
      addSongs(songs) {
        songs.map(song => {
          self.songs.push(song.id);
        });
      },
    };
  });

export default SongOfQueueStore;
