
import { types } from "mobx-state-tree"
import { values } from "mobx";

export const Song = types.model("Song", {
  name: types.string,
  thumb: types.string,
  artist: types.string,
  favorite: types.maybeNull(types.boolean)
}).views(self => {
  return {
    getName() {
      return self.name
    },
    getSubTitlte() {
      return self.artist;
    },
    isFavorite() {
      return self.favorite == true; // for cace undefine
    },
    getThumb() {
      return self.thumb;
    }
  }
}).actions(self => {
  return {
    toggleFavorite() {
      self.favorite = !(self.favorite == true);
    }
  }
})