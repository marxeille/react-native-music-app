import { types } from 'mobx-state-tree';
import { BASE_API_URL } from '../../constant/constant';
import { subLongStr } from '../../utils';

export const PlayList = types
  .model('PlayList', {
    id: types.identifier,
    name: types.string,
    thumb: types.string,
    owner: types.array(types.frozen({ id: types.number, name: types.string })),
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
        return subLongStr(self.owner.map(o => o.name).join(','), 20);
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

export const createPlaylistFromApiJson = data => {
  return PlayList.create({
    id: data.id.toString(),
    name: data.name ?? '',
    thumb: data.playlistCover ? BASE_API_URL + data.playlistCover : '',
    owner: data.artists ?? [],
    private: data.private ?? null,
    tracks: data.tracks ?? [],
    type: 'playlist',
  });
};

export const createPlaylistFromJson = data => {
  return PlayList.create({
    id: data.id.toString(),
    name: data.name ?? '',
    thumb: data.thumb ? BASE_API_URL + data.thumb : '',
    owner: data.owner ?? '',
    tracks: data.tracks ?? [],
    type: 'playlist',
  });
};
