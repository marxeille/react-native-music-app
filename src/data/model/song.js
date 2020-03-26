import { types } from 'mobx-state-tree';
import { values } from 'mobx';
import { BASE_API_URL } from '../../constant/constant';

export const Song = types
  .model('Song', {
    id: types.identifier,
    title: types.string,
    artwork: types.string,
    artist: types.string,
    url: types.string,
    favorite: types.maybeNull(types.boolean),
  })
  .views(self => {
    return {
      getName() {
        return self.title;
      },
      getSubTitle() {
        return self.artist;
      },
      isFavorite() {
        return self.favorite == true; // for case undefine
      },
      getThumb() {
        return self.artwork;
      },

      getType() {
        return self.type;
      },

      getDataJson() {
        return {
          id: self.id,
          title: self.title,
          artist: self.artist,
          artwork: self.artwork,
          url: self.url,
          type: self.type,
          favorite: false,
        };
      },
    };
  })
  .actions(self => {
    return {
      toggleFavorite() {
        self.favorite = !(self.favorite == true);
      },
    };
  });

export const createSongFromJson = data => {
  return Song.create({
    id: data.id.toString(),
    title: data.title,
    artist: data.artist,
    artwork: data.artwork,
    url: data.url,
    favorite: false,
    type: 'song',
  });
};

export const createSongFromJsonApi = data => {
  return Song.create({
    id: data.id.toString(),
    title: data.title,
    artist: data.artist ?? 'Chưa xác định',
    artwork: BASE_API_URL + data.cover_path,
    url: data.track_url ?? '',
    duration: data.duration,
    favorite: false,
    type: 'song',
  });
};
