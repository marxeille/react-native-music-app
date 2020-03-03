import { types, flow } from 'mobx-state-tree';
import { Result } from './result';
import { Song } from '../model/song';
import { PlayList } from '../model/playlist';

const SongOfAlPlaylistStore = types.model('SongOfAlPlaylistStore',
  {
    id: types.string,
    state: Result,
    songs: types.array(types.string),

  }).actions(self => {
    return {
      fetchData() {

      }
    }
  }).actions(self => {
    return {
      addList(ids) {
        self.songs.push(...ids);
      }
    }
  })

export default SongOfAlPlaylistStore;