import { types, flow } from 'mobx-state-tree';
import { Result } from '../../../../data/repository/result';
import { Song, createSongFromJsonApi } from '../../../../data/model/song';
import { apiService } from '../../../../data/context/api_context';
import { getTrackFullDetail } from '../../../../data/datasource/api_helper';

export const CreatePlaylistModel = types
  .model('CreatePlaylistModel', {
    state: Result,
    name: types.string,
    description: types.maybeNull(types.string),
    public: types.optional(types.boolean, false),
    songs: types.optional(types.map(Song), {}),
    searchResult: types.optional(types.map(Song), {}),
  })
  .actions(self => {
    return {
      setPlaylistName(name) {
        self.name = name;
      },
      setPlaylistDescription(description) {
        self.description = description;
      },
      setPublicState(state) {
        self.public = state;
      },
      putSong(song) {
        if (self.songs.get(song.id)) {
          self.songs.get(song.id).update(song);
        } else {
          const newSong = createSongFromJsonApi(song);
          self.songs.put(newSong);
        }
      },
      removeSong(song) {
        if (self.songs.get(song.id)) {
          self.songs.delete(song.id);
        }
      },
      setResultSong(song) {
        self.searchResult.clear();
        const newSong = createSongFromJsonApi(song);
        self.searchResult.put(newSong);
      },
      searchByKeyword: flow(function* searchByKeyword(keyword) {
        try {
          self.state = 'loading';
          const result: Array = yield apiService.commonApiService.searchByKeyword(
            keyword,
          );
          if (result.status == 200) {
            if (result.data.hits.tracks.length > 0) {
              result.data.hits.tracks.forEach(async data => {
                const trackDetail = await apiService.trackApiService.getTrackInfo(
                  data.id,
                );
                getTrackFullDetail(data.id).then(res => {
                  let fullTrack = { ...trackDetail.data, ...res };
                  fullTrack = {
                    ...fullTrack,
                    id: fullTrack.id.toString(),
                    articleId: fullTrack.article ? fullTrack.article.id : 0,
                    artistId: fullTrack.artists[0]?.id ?? 0,
                    artists: fullTrack.artists.map(a => a.name),
                    artwork: '',
                  };
                  self.setResultSong(fullTrack);
                });
              });
            }
          }
          self.state = 'success';
        } catch (err) {
          console.log('err', err);
        }
      }),
    };
  });
