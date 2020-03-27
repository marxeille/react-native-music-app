import { types } from 'mobx-state-tree';

export const Artist = types
  .model('Artist', {
    id: types.identifier,
    name: types.string,
    thumb: types.string,
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
      getType() {
        return self.type;
      },
    };
  });

export const createArtistFromApiJson = data => {
  return Artist.create({
    id: data.id.toString(),
    name: data.name ?? '',
    thumb: data.thumb ?? 'https://picsum.photos/200',
    type: 'artist',
  });
};
