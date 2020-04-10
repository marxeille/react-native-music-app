import { types } from 'mobx-state-tree';
import { subLongStr } from '../../utils';
import { BASE_API_URL } from '../../constant/constant';

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
        return subLongStr(self.owner, 25);
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
    thumb: data.cover_path ? BASE_API_URL + data.cover_path : '',
    owner: data.artists ? data.artists.map(a => a.name).join(', ') : '',
    tracks: data.tracks ?? [],
    type: 'article',
  });
};
