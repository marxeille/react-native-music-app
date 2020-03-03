import { types, flow } from 'mobx-state-tree';
import { Result } from './result';
import { Song } from '../model/song';
import { Album } from '../model/album';

const SongOfAlBumStore = types.model(
  {
    album: types.reference(Album),
    state: Result,
    songs: types.array(types.reference(Song))
  }
).actions(self => {
  return {
    fetchData() {

    }
  }
});

export default SongOfAlBumStore;