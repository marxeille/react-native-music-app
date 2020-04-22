import { types } from 'mobx-state-tree';
import { BASE_API_URL } from '../../constant/constant';
import { subLongStr } from '../../utils';

export const PlayList = types
  .model('PlayList', {
    id: types.identifier,
    name: types.string,
    thumb: types.string,
    owner: types.string,
    owner_id: types.number,
    private: types.boolean,
    short_biography: types.string,
    bio: types.string,
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
        self.tracks = newJson.tracks;
      },
    };
  });

export const createPlaylistFromApiJson = data => {
  return PlayList.create({
    id: data.id.toString(),
    name: data.name ?? '',
    thumb: data.playlistCover ? BASE_API_URL + data.playlistCover : '',
    owner: data.artists ? data.artists.map(a => a.name).join(', ') : '',
    owner_id: data.owner_id ?? 0,
    private: data.private ?? false,
    tracks: data.tracks ?? [],
    short_biography: data.short_biography ?? '',
    bio: data.biography ?? '',
    type: 'playlist',
  });
};

export const createPlaylistFromJson = data => {
  return PlayList.create({
    id: data.id.toString(),
    name: data.name ?? '',
    thumb: data.thumb ? BASE_API_URL + data.thumb : null,
    owner: data.owner ?? '',
    tracks: data.tracks ?? [],
    type: 'playlist',
  });
};
