import { observable } from 'mobx';
import { types, onSnapshot, flow, getParent } from 'mobx-state-tree';
import { Song } from '../model/song';
// import TrackPlayer from 'react-native-track-player';
import * as _ from 'lodash';
import MusicControl from 'react-native-music-control';

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
        return [...getParent(self).songs.values()];
      },

      getQueueSize() {
        return getParent(self).songs.size;
      },

      prepareSong(id) {
        //Get list of songs
        const songs = self.getSongs();

        //Define track
        let track;

        if (self.selectedId == null || id !== null) {
          // Case 0: User choose a new song from list
          if (!id) {
            // Case 1: no song in queue, start new song with no ID
            //set Track
            track = songs[self.trackIndex];
            //set new song
            self.startNewSong(track.id);
          } else {
            //Case 5: no song in queue, start new song WITH ID
            track = getParent(self).songs.get(id);
            // Set track index by track id
            self.setTrackIndex(_.findIndex(self.getSongs(), ['id', track.id]));
            //set new song
            self.startNewSong(track.id);
          }
        } else {
          //Case 4: Continue current track(in case user from another screen get into player screen)
          track = getParent(self).songs.get(self.selectedId);
        }

        // Play song
        self.playSong(track.id);
      },

      changeSong(trackStatus) {
        const songs = self.getSongs();
        let track;
        if (trackStatus == 'next') {
          //Case 2: next track (with shuffle or not)
          if (self.trackIndex < songs.length - 1) {
            //Check if it is the last track of queue
            self.setTrackIndex(
              !self.shuffle
                ? self.trackIndex + 1
                : Math.floor(Math.random() * Math.floor(self.getQueueSize())),
            );
            track = songs[self.trackIndex];
            self.startNewSong(track.id);
          }
        } else {
          //Case 3: back track(no shuffle)
          self.setTrackIndex(self.trackIndex - 1);
          track = songs[self.trackIndex];
          self.startNewSong(track.id);
        }

        //play song
        if (track) self.playSong(track.id);
      },

      startNewSong(trackId) {
        self.setPosition(0);
        self.setDuration(0);
        self.setSelectedId(trackId);
      },

      setState(state) {
        if (state == 'pause') {
          self.statusPlayer = 'pause';
        } else {
          self.statusPlayer = 'playing';
        }
      },
      setPosition(position) {
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
        self.setState(true);
        // Basic Controls
        MusicControl.enableControl('play', true);
        MusicControl.enableControl('pause', true);
        MusicControl.enableControl('nextTrack', true);
        MusicControl.enableControl('previousTrack', true);
        MusicControl.enableControl('stop', true);
        MusicControl.on('pause', () => {
          self.pause();
        });
        MusicControl.on('play', () => {
          self.play();
        });
        MusicControl.on('nextTrack', () => {
          if (self.trackIndex < self.getQueueSize() - 1) {
            self.changeSong('next');
          }
        });
        MusicControl.on('previousTrack', () => {
          if (self.trackIndex > 0) {
            self.changeSong('back');
          }
        });

        // MusicControl.on('seekForward', () => {
        //   self.changeSong('back');
        // });

        // Seeking
        MusicControl.enableControl('seekForward', true); // iOS only
        MusicControl.enableControl('seekBackward', true); // iOS only
        MusicControl.enableControl('seek', true); // Android only
        MusicControl.enableControl('skipForward', false);
        MusicControl.enableControl('skipBackward', false);
        // Android Specific Options
        MusicControl.enableControl('setRating', false);
        MusicControl.enableControl('volume', true); // Only affected when remoteVolume is enabled
        MusicControl.enableControl('remoteVolume', false);
        // Set Now Playing
        MusicControl.setNowPlaying({
          title: self.currentSong.getName(),
          artwork: self.currentSong.getThumb(), // URL or RN's image require()
          artist: self.currentSong.getSubTitle(),
          // album: 'Thriller',
          // genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',
          duration: self.currentSong.duration ?? 100, // (Seconds)
          description: '', // Android Only
          color: 0xffffff, // Notification Color - Android Only
          // date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
          rating: 84, // Android Only (Boolean or Number depending on the type)
          // notificationIcon: 'my_custom_icon', // Android Only (String), Android Drawable resource name for a custom notification icon
        });
      },
    };
  });
