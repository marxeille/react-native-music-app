import { types } from 'mobx-state-tree';
import { values } from 'mobx';

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
      getSubTitlte() {
        return self.artist;
      },
      isFavorite() {
        return self.favorite == true; // for case undefine
      },
      getThumb() {
        return self.artwork;
      },

      getDataJson() {
        return {
          id: self.id,
          title: self.title,
          artist: self.artist,
          artwork: self.artwork,
          url: self.url,
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
  });
};
