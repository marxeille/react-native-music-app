
import { types } from "mobx-state-tree"
import { values } from "mobx";

export const Song = types.model("Song", {
  id: types.identifier,
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
      return self.favorite == true; // for case undefine
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

export const createSongFromJson = (data) => {
  return Song.create({
    id: data.id,
    name: data.title,
    artist: data.artist,
    thumb: data.artwork,
    favorite: false,
  })
}

/*
{
    "id": "2",
    "url": "https://drive.google.com/uc?export=download&id=1VM9_umeyzJn0v1pRzR1BSm9y3IhZ3c0E",
    "title": "Soul Searching (Demo)",
    "artist": "David Chavez",
    "artwork": "https://picsum.photos/200"
  },
*/

