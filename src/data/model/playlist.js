import { types } from 'mobx-state-tree';

export const PlayList = types
  .model('PlayList', {
    id: types.identifier,
    name: types.string,
    thumb: types.string,
    owner: types.string,
    tracks: types.array(
      types.frozen({ track_id: types.string, position: types.integer }),
    ),
  })
  .views(self => {
    return {
      title() {
        return self.name;
      },
      subTitle() {
        return self.artist;
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

export const createPlaylistFromJson = data => {
  return PlayList.create({
    id: data.id.toString(),
    name: data.name ?? '',
    thumb: data.thumb ?? '',
    owner: data.owner ?? '',
    tracks: data.tracks ?? [],
  });
};
