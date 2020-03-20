import { types, flow } from 'mobx-state-tree';
import { Result } from './result';
import { Song, createSongFromJson } from '../model/song';
import { Album } from '../model/album';
import { apiService } from '../context/api_context';

const SongOfAlBumStore = types
  .model({
    id: types.string,
    state: Result,
    songs: types.optional(types.array(types.reference(Song)), []),
    songIds: types.array(types.string),
  })
  .actions(self => {
    return {
      getSongs: flow(function* getRecently() {
        const recently: Array = yield apiService.commonApiService.getSongsOfAlBum();
        recently.forEach(data => {
          self.songs.push(createSongFromJson(data));
        });
        self.state = 'success';
      }),
      addList(ids) {
        self.songIds.push(...ids);
      },
    };
  });

export default SongOfAlBumStore;
