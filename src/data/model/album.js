import { types } from 'mobx-state-tree';
import { Song } from './song';

export const Album = types
  .model('Album', {
    id: types.identifier,
    name: types.string,
    thumb: types.string,
    owner: types.string,
    tracks: types.maybe(
      types.array(
        types.frozen({ track_id: types.string, position: types.integer }),
      ),
    ),
    type: types.string,
  })
  .views(self => {
    return {
      title() {
        return self.name;
      },
      subTitle() {
        return self.owner;
      },
      getThumb() {
        return self.thumb;
      },
      getType() {
        return self.type;
      },
    };
  })
  .actions(self => {
    return {
      update(newJson) {
        self.name = newJson.name;
      },
    };
  });

export const createAlbumFromApiJson = data => {
  return Album.create({
    id: data.id.toString(),
    name: data.name ?? '',
    thumb: data.thumb ?? '',
    owner: data.owner ?? '',
    tracks: data.tracks ?? [],
    type: 'article',
  });
};
