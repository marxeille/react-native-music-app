import { types, flow } from 'mobx-state-tree';
import { Result } from '../../../data/repository/result';
import { Song, createSongFromJson } from '../../../data/model/song';
import { apiService } from '../../../data/context/api_context';

export const ALbumModel = types
  .model('ALbumModel', {
    state: Result,
    songs: types.map(Song),
  })
  .actions(self => {
    return {
      getSongs: flow(function* getSongs() {
        self.state = 'loading';
        const songs: Array = yield apiService.commonApiService.getSongsOfAlBum();
        songs.forEach(data => {
          self.songs.put(createSongFromJson(data));
        });

        self.state = 'success';
      }),
    };
  })
  .views(self => {
    return {};
  });
