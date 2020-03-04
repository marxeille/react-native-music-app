import { types, flow } from 'mobx-state-tree';
import { Result } from './result';
import { Song } from '../model/song';
import { Album } from '../model/album';

const SongOfAlBumStore = types.model(
  {
    id: types.string,
    state: Result,
    songs: types.array(types.string)
  }
).actions(self => {
  return {
    addList(ids) {
      self.songs.push(...ids);
    }
  }
});

export default SongOfAlBumStore;