import { types } from 'mobx-state-tree';

export const Artist = types
  .model('Artist', {
    id: types.identifier,
    name: types.string,
    thumb: types.string,
    short_biography: types.string,
    type: types.string,
  })
  .views(self => {
    return {
      getName() {
        return self.name;
      },
      getSubTitle() {
        return 'Nghệ sĩ';
      },
      getThumb() {
        return self.thumb;
      },
      getBio() {
        return self.short_biography;
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
        self.thumb = newJson.thumb;
      },
    };
  });

export const createArtistFromApiJson = data => {
  return Artist.create({
    id: data.id.toString(),
    name: data.name ?? '',
    thumb: data.thumb ?? 'https://picsum.photos/200',
    short_biography: data.short_biography ?? '',
    type: 'artist',
  });
};
