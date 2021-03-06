import { types } from 'mobx-state-tree';
import { BASE_API_URL } from '../../constant/constant';
import { subLongStr, isTextEmpty } from '../../utils';
import { uniq } from 'lodash';

export const Song = types
  .model('Song', {
    id: types.identifier,
    title: types.string,
    artwork: types.string,
    artist: types.string,
    artistId: types.number,
    articleId: types.number,
    url: types.string,
    type: types.string,
    duration: types.integer,
    favorite: types.maybeNull(types.boolean),
  })
  .views(self => {
    return {
      getName() {
        return self.title;
      },
      getSubTitle(limit = true) {
        return !isTextEmpty(self.artist)
          ? limit
            ? subLongStr(self.artist, 25)
            : self.artist
          : 'Chưa xác định';
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
          duration: self.duration ?? 0,
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
      update(newJson) {
        self.name = newJson.name;
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
    duration: data.duration ?? 100,
    type: 'song',
  });
};

export const createSongFromJsonApi = data => {
  return Song.create({
    id: data?.id?.toString(),
    title: data.title,
    artist: data.artists
      ? uniq(data.artists).join(', ')
      : data.artist
      ? data.artist
      : '',
    artistId: data.artistId ?? 0,
    articleId: data.articleId ?? 0,
    artwork: data.cover_path
      ? BASE_API_URL + data.cover_path
      : data.artwork
      ? data.artwork
      : '',
    url: data.track_url ? data.track_url : data.url ?? '',
    duration: data.duration ?? 100,
    favorite: false,
    type: 'song',
  });
};
