import { types, flow, getParent } from 'mobx-state-tree';
import { Song } from '../model/song';
import * as _ from 'lodash';
import MusicControl from 'react-native-music-control';
import AsyncStorage from '@react-native-community/async-storage';
import { AsyncStorageKey } from '../../constant/constant';

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
    repeatOne: types.optional(types.boolean, false),
    shuffle: types.optional(types.boolean, false),
    playFrom: types.optional(types.string, 'Home'),
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

      clearSong() {
        self.currentSong = null;
      },

      setPlayFrom(name) {
        self.playFrom = name;
      },

      play: flow(function* play() {
        self.statusPlayer = 'playing';
      }),

      pause: flow(function* pause() {
        self.statusPlayer = 'pause';
      }),

      getSongs() {
        return [
          ...getParent(self).queueStore.getSongs(),
          ...getParent(self).playlistSongStore.getSongs(),
        ];
      },

      getQueueSize() {
        return self.getSongs().length;
        // return getParent(self).songs.size;
      },

      prepareSong(id, seek) {
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
            self.startNewSong(track?.id);
          } else {
            //Case 5: no song in queue, start new song WITH ID
            track = getParent(self).songs.get(id);
            // Set track index by track id
            // Minus the length of queue song, cause we will remove those song later on
            self.setTrackIndex(
              _.findIndex(songs, ['id', track?.id]) -
                [...getParent(self).queueStore.getSongs()].length,
            );
            // //set new song
            self.startNewSong(track?.id);
          }
        } else {
          //Case 4: Continue current track(in case user from another screen get into player screen)
          track = getParent(self).songs.get(self.selectedId);
        }
        // Play song
        if (track) {
          if (track?.id !== self.currentSong?.id) {
            self.addCurrentSongToHistory(track);
            self.playSong(track);
          } else {
            if (typeof seek == 'function') {
              seek(0);
              self.setPosition(0);
            }
          }
        }
      },

      changeSong(trackStatus, seek) {
        const songs = self.getSongs();
        let track;
        if (trackStatus == 'next') {
          // Check if there is a queue, and play it first
          if ([...getParent(self).queueStore.getSongs()].length > 0) {
            track = songs[getParent(self).queueStore.queueIndex];
            // remove song from queue after play
            getParent(self).queueStore.removeSongs([track?.id]);
            // add played song into history
            self.startNewSong(track?.id);
            //play song
            if (track) {
              if (track?.id !== self.currentSong.id) {
                self.playSong(track);
              } else {
                if (typeof seek == 'function') {
                  seek(0);
                  self.setPosition(0);
                }
              }
            }
            return;
          } else {
            //Case 2: next track (with shuffle or not)
            //Check if it's the last track of queue
            if (self.trackIndex < songs.length - 1) {
              self.setTrackIndex(
                !self.shuffle
                  ? self.trackIndex + 1 // With no shuffle
                  : Math.floor(Math.random() * Math.floor(self.getQueueSize())), // with shuffle on
              );
              track = songs[self.trackIndex];
              self.startNewSong(track?.id);
            } else {
              //if this is the last track and no repeat, set state to pause
              if (!self.repeat || songs.length == 1) {
                self.setState('pause');
              } else {
                // if repeat option on
                if (self.repeat) {
                  self.setTrackIndex(0);
                  track = songs[self.trackIndex];
                  self.startNewSong(track?.id);
                }
              }
            }
          }
        } else {
          //Case 3: back track(no shuffle)
          self.setTrackIndex(self.trackIndex - 1);
          track = songs[self.trackIndex];
          self.startNewSong(track?.id);
        }

        //play song
        if (track) {
          if (track?.id !== self.currentSong.id) {
            self.addCurrentSongToHistory(track);
            self.playSong(track);
          } else {
            if (typeof seek == 'function') {
              seek(0);
              self.setPosition(0);
            }
          }
          self.addToLocalHistory(track);
        }
      },

      addCurrentSongToHistory(track) {
        const trackWithOwner = {
          ...track,
          owner_id: getParent(self).userStore.id,
        };

        // Here is the part that we save history into local storage
        AsyncStorage.setItem(
          AsyncStorageKey.SONG,
          JSON.stringify(trackWithOwner),
        );
      },

      addToLocalHistory: flow(function* addToLocalHistory(track) {
        const trackWithOwner = {
          ...track,
          owner_id: getParent(self).userStore.id,
        };
        // Save history
        getParent(self).historyStore.addSong(track.id);
        const localHistory = yield AsyncStorage.getItem(
          AsyncStorageKey.HISTORY,
        );
        let localHistoryJson = JSON.parse(localHistory);
        const idExist = _.find(localHistoryJson, function(h) {
          return h.id == track.id && h.owner_id == getParent(self).userStore.id;
        });
        //In case there is already a data list in local storage
        if (localHistoryJson !== null) {
          let localHistoryJsonWithOwner = _.filter(
            localHistoryJson,
            history => history.owner_id == getParent(self).userStore.id,
          );

          if (!idExist) {
            if (localHistoryJsonWithOwner.length < 10) {
              localHistoryJson.push(trackWithOwner);
              AsyncStorage.setItem(
                AsyncStorageKey.HISTORY,
                JSON.stringify(localHistoryJson),
              );
            } else {
              localHistoryJson.shift();
              localHistoryJson.push(trackWithOwner);
              AsyncStorage.setItem(
                AsyncStorageKey.HISTORY,
                JSON.stringify(localHistoryJson),
              );
            }
          }
        } else {
          //If not, create a new one
          const newLocalData = [];
          newLocalData.push(trackWithOwner);
          AsyncStorage.setItem(
            AsyncStorageKey.HISTORY,
            JSON.stringify(newLocalData),
          );
        }
      }),

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
      setRepeatOne(value) {
        self.repeatOne = value;
      },
      setShuffle(value) {
        self.shuffle = value;
      },
      setCurrentSong(song) {
        self.currentSong = song;
      },
      setMusicControl() {
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
          if (self.trackIndex < self.getQueueSize()) {
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
          title: self.currentSong?.getName() ?? 'Chưa xác định',
          artwork: self.currentSong?.getThumb() ?? '', // URL or RN's image require()
          artist: self.currentSong?.getSubTitle() ?? 'Chưa xác định',
          // album: 'Thriller',
          // genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',
          duration: self.currentSong?.duration ?? 0, // (Seconds)
          description: '', // Android Only
          color: 0xffffff, // Notification Color - Android Only
          // date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
          rating: 84, // Android Only (Boolean or Number depending on the type)
          // notificationIcon: 'my_custom_icon', // Android Only (String), Android Drawable resource name for a custom notification icon
        });
      },
      playSong(song) {
        if (getParent(self).songs.get(song.id)) {
          self.setCurrentSong(song.id);
          if (self.position == 0 && self.currentSong?.url !== '') {
            self.setState(true);
          }
          self.setMusicControl();
        } else {
          getParent(self).createSongRef(song);
          self.setCurrentSong(song.id);
          if (self.position == 0 && self.currentSong?.url !== '') {
            self.setState(true);
          }
          self.setMusicControl();
        }
      },
    };
  });
