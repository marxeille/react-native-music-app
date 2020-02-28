
import { types } from "mobx-state-tree"
import { values } from "mobx";

export const Song = types.model("Song", {
  name: types.string,
  thumb: types.string,
  artist: types.string,
}).views(self => {
  return {
    getName() {
      return self.name
    },
    getSubTitlte() {
      return self.artist;
    },

    getThumb() {
      return self.thumb;
    }

  }
})