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
    thumb:
      data.thumb ??
      'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBVzjuG.img?h=597&w=660&m=6&q=60&o=f&l=f&x=300&y=232',
    type: 'artist',
  });
};
