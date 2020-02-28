import { types } from 'mobx-state-tree';

export const PlayList = types.model("PlayList", {
  id: types.identifier,
  name: types.string,
  thumb: types.string,
  artist: types.string
}).views(self => {
  return {
    title() {
      return self.name;
    },
    subTitle() {
      return self.artist;
    },
    getThumb() {
      return self.thumb;
    }
  }
});