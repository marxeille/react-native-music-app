import { types, flow } from 'mobx-state-tree';
import { Result } from './result';
import { Song } from '../model/song';
import { indexOf, map } from 'lodash';

const SongOfAlPlaylistStore = types
  .model('SongOfAlPlaylistStore', {
    id: types.maybeNull(types.string),
    state: types.maybeNull(Result),
    songs: types.optional(types.array(types.reference(Song)), []),
  })
  .actions(self => {
    return {
      clearListSongs() {
        self.songs = [];
      },
      addList(ids) {
        console.log('ids', ids);

        self.clearListSongs();
        self.songs.push(...ids);
      },
      addSong(song) {
        if (indexOf(map([...self.songs], 'id'), song.id) < 0) {
          self.songs.push(song.id);
        }
      },
      addNewPlaylist(songs) {
        self.songs = [];
        songs.map(song => {
          self.addSong(song);
        });
      },
    };
  })
  .views(self => {
    return {
      getSongs() {
        return self.songs.map(data => {
          return data.getDataJson();
        });
      },
    };
  });

export default SongOfAlPlaylistStore;
