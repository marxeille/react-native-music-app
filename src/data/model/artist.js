import { types } from 'mobx-state-tree';
import { BASE_API_URL } from '../../constant/constant';

export const Artist = types
  .model('Artist', {
    id: types.identifier,
    name: types.string,
    thumb: types.string,
    short_biography: types.string,
    bio: types.string,
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
        self.thumb = newJson.thumb
          ? newJson.thumb
          : newJson.avatar_thumb_path
          ? newJson.avatar_thumb_path
          : '';
      },
    };
  });

export const createArtistFromApiJson = data => {
  return Artist.create({
    id: data.id.toString(),
    name: data.name ?? '',
    thumb: data.avatar_thumb_path ? BASE_API_URL + data.avatar_thumb_path : '',
    short_biography: data.short_biography ?? '',
    bio: data.biography ?? '',
    type: 'artist',
  });
};
