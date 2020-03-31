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
  return Artist.create({
    id: data.id.toString(),
    name: data.name ?? '',
    thumb: data.thumb ?? '',
    owner: data.owner ?? '',
    tracks: data.tracks ?? [],
  });
};
