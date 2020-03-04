import { observable } from "mobx";
import { types, onSnapshot } from "mobx-state-tree"
import { Song } from '../model/song'

export const PlayerState = types.enumeration("PlayerState", ['pause', 'playing'])

export const PlayerStore = types.model("PlayerStore", {
  currentSong: types.maybeNull(types.reference(Song)),
  statusPlayer: types.maybeNull(PlayerState)
}).actions(self => {
  return {
    toggleStatus() {
      if (self.statusPlayer == 'pause') {
        self.statusPlayer = 'playing';
      } else {
        self.statusPlayer = 'pause';
      }
    }
  }
})
