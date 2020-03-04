import { observable } from "mobx";
import { types, onSnapshot, flow } from "mobx-state-tree"
import { Song } from '../model/song'
import TrackPlayer from "react-native-track-player";

export const PlayerState = types.enumeration("PlayerState", ['pause', 'playing'])

export const PlayerStore = types.model("PlayerStore", {
  currentSong: types.maybeNull(types.reference(Song)),
  statusPlayer: types.maybeNull(PlayerState)
}).actions(self => {
  return {
    toggleStatus() {
      if (self.statusPlayer == 'pause') {
        self.play();
      } else {
        self.pause();
      }
    },

    play: flow(function* play() {
      yield TrackPlayer.play();
      self.statusPlayer = 'playing';
    }),

    pause: flow(function* pause() {
      yield TrackPlayer.pause();
      self.statusPlayer = 'pause';
    }),

    setState(state) {
      if (state == 'pause') {
        self.statusPlayer = 'pause';
      } else {
        self.statusPlayer = 'playing';
      }
    },

    playSong(song) {
      console.log('DEBUG => player_store playSong song ', song);
      self.currentSong = song;
    }
  }
})
