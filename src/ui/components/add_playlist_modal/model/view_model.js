import { types, flow } from 'mobx-state-tree';
import { Result } from '../../../../data/repository/result';
import { Song, createSongFromJsonApi } from '../../../../data/model/song';
import { apiService } from '../../../../data/context/api_context';
import {
  getTrackFullDetail,
  getPlaylistCover,
} from '../../../../data/datasource/api_helper';
import { rootStore } from '../../../../data/context/root_context';
import { uploadImage } from '../../../../data/datasource/api_config';
import { isTextEmpty } from '../../../../utils';
import Toast from 'react-native-simple-toast';

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
      //Create playlist
      createPlaylist: flow(function* createPlaylist(playlist) {
        const createPl = yield apiService.commonApiService.createPlaylist(
          playlist,
        );
        if (createPl.status == 201) {
          let cover = yield getPlaylistCover(
            playlist.tracks,
            !isTextEmpty(playlist.cover),
          );
          if (!isTextEmpty(playlist.cover)) {
            const plCover = yield uploadImage(
              `/api/playlists/${createPl.data.id}/cover`,
              playlist.cover,
              'cover',
            );
            if (plCover.status == 201) {
              cover = { ...cover, playlistCover: plCover.data.cover_path };
            }
          }
          // like playlist after create
          yield apiService.commonApiService.like('playlist', createPl.data.id);
          const playlistFullInfo = { ...createPl.data, ...cover };
          rootStore.updatePlayList(playlistFullInfo);
          rootStore.libraryStore?.updatePlayList(playlistFullInfo);
          rootStore.homeStore?.addPopular(playlistFullInfo);
          Toast.showWithGravity('Tạo thành công', Toast.LONG, Toast.BOTTOM);
        } else {
          Toast.showWithGravity('Vui lòng thử lại', Toast.LONG, Toast.BOTTOM);
        }
      }),
      //
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
                    artistId: fullTrack.credit_info[0]?.artist.id ?? 0,
                    artists: fullTrack.credit_info.map(a => a.artist.name),
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
