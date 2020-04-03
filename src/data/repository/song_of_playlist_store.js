import { types, flow } from 'mobx-state-tree';
import { Result } from './result';
import { Song } from '../model/song';

const SongOfAlPlaylistStore = types
  .model('SongOfAlPlaylistStore', {
    id: types.maybeNull(types.string),
    state: types.maybeNull(Result),
    songs: types.optional(types.array(types.reference(Song)), []),
  })
  .actions(self => {
    return {
      addList(ids) {
        self.songs.push(...ids);
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

export default SongOfAlPlaylistStore;
