import { types } from 'mobx-state-tree';
import { subLongStr } from '../../utils';
import { BASE_API_URL } from '../../constant/constant';

export const Album = types
  .model('Album', {
    id: types.identifier,
    name: types.string,
    thumb: types.string,
    owner: types.string,
    short_biography: types.string,
    description: types.string,
    tracks: types.maybe(
      types.array(
        types.frozen({ track_id: types.string, position: types.integer }),
      ),
    ),
    type: types.string,
  })
  .views(self => {
    return {
      getName() {
        return self.name;
      },
      getSubTitle() {
        return subLongStr(self.owner, 25);
      },
      getThumb() {
        return self.thumb;
      },
      getType() {
        return self.type;
      },
      getDescription() {
        return self.description;
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
    thumb: data.cover_path ? BASE_API_URL + data.cover_path : '',
    owner: data.artists ? data.artists.map(a => a.name).join(', ') : '',
    short_biography: data.short_biography ?? '',
    description: data.description ?? '',
    tracks: data.tracks ?? [],
    type: 'article',
  });
};
