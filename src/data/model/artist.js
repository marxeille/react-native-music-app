import { types } from 'mobx-state-tree';

export const Artist = types.model("Artist", {
  id: types.identifier,
  name: types.string,
  thumb: types.string,
}).views(self => {
  return {
    title() {
      return self.name;
    },
    getThumb() {
      return self.thumb;
    }
  }
});