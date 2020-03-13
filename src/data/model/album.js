import { types } from 'mobx-state-tree';
import { Song } from './song';

export const Album = types
  .model('Album', {
    id: types.identifier,
    name: types.string,
    thumb: types.string,
    songs: types.map(types.reference(Song)),
  })
  .views(self => {
    return {
      title() {
        return self.name;
      },
      getThumb() {
        return self.thumb;
      },
    };
  });
