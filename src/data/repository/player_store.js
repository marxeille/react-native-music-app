import { observable } from 'mobx';
import { types, onSnapshot, flow, getParent } from 'mobx-state-tree';
import { Song } from '../model/song';
// import TrackPlayer from 'react-native-track-player';
import * as _ from 'lodash';

export const PlayerState = types.enumeration('PlayerState', [
  'pause',
  'playing',
]);

export const PlayerStore = types
  .model('PlayerStore', {
    selectedId: types.maybeNull(types.string),
    trackIndex: types.optional(types.integer, 0),
    currentSong: types.maybeNull(types.reference(Song)),
    statusPlayer: types.maybeNull(PlayerState),
    duration: types.maybeNull(types.number),
    position: types.optional(types.number, 0),
    repeat: types.optional(types.boolean, false),
    shuffle: types.optional(types.boolean, false),
  })
  .actions(self => {
    return {
      toggleStatus() {
        if (self.statusPlayer == 'pause') {
          self.play();
        } else {
          self.pause();
        }
      },

      play: flow(function* play() {
        // yield TrackPlayer.play();
        self.statusPlayer = 'playing';
      }),

      pause: flow(function* pause() {
        // yield TrackPlayer.pause();
        self.statusPlayer = 'pause';
      }),

      getSongs() {
        return [...getParent(self).songs];
      },

      getQueueSize() {
        return getParent(self).songs.size;
      },

      prepareSong(trackStatus) {
        const songs = self.getSongs();
        let track;

        if (self.selectedId == null) {
          track = songs[self.trackIndex][1];
          self.setPosition(0);
          self.setDuration(0);
          self.setSelectedId(track.id);
        } else {
          if (trackStatus == 'next') {
            self.setTrackIndex(self.trackIndex + 1);
            track = songs[self.trackIndex][1];
            self.setPosition(0);
            self.setDuration(0);
            self.setSelectedId(track.id);
          } else if (trackStatus == 'back') {
            self.setTrackIndex(self.trackIndex - 1);
            track = songs[self.trackIndex][1];
            self.setPosition(0);
            self.setDuration(0);
            self.setSelectedId(track.id);
          } else {
            track = getParent(self).songs.get(self.selectedId);
          }
        }
        self.playSong(track.id);
      },

      setState(state) {
        if (state == 'pause') {
          self.statusPlayer = 'pause';
        } else {
          self.statusPlayer = 'playing';
        }
      },
      setPosition(position) {
        // const parent = getParent(self).songs;
        self.position = position;
      },
      setDuration(duration) {
        self.duration = duration;
      },
      setSelectedId(id) {
        self.selectedId = id;
      },
      setTrackIndex(i) {
        self.trackIndex = i;
      },
      setRepeat(value) {
        self.repeat = value;
      },
      setShuffle(value) {
        self.shuffle = value;
      },
      playSong(song) {
        self.currentSong = song;
      },
    };
  });
