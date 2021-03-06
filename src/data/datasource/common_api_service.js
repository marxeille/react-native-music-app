import {
  BASE_URL,
  privateRequest,
  privateRequestWithToken,
} from './api_config';
//Hanle data từ Api Services
export default class CommonApiService {
  async getUserInfo() {
    try {
      const path = '/api/my';
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async getPlaylists() {
    try {
      const path = '/api/playlists';
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async getHomeTrackIds() {
    try {
      const path = '/api/top/tracks';
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async getRencentTrackIds() {
    try {
      const path = '/api/my/recent/tracks';
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async getTracks(ids) {
    try {
      const path = `/api/tracks?ids=${ids}`;
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async getHomePlaylists() {
    try {
      const path = '/api/top/playlists';
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async searchByKeyword(q) {
    try {
      const path = '/api/content/search';
      return await privateRequest(BASE_URL.get, path, { q: q });
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async getLikedTracks(ids) {
    try {
      let path = '/api/like/track';
      if (ids) {
        path += '?ids=' + ids;
      }
      return await privateRequest(BASE_URL.get, path, { per_page: 50 });
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async like(type, id) {
    try {
      const path = `/api/like/${type}`;
      return await privateRequest(BASE_URL.post, path, { entity_id: id });
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async unlike(type, id) {
    try {
      const path = `/api/like/${type}/${id}`;
      return await privateRequest(BASE_URL.delete, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async refreshToken(refreshToken) {
    try {
      const path = `/api/token/refresh`;
      return await privateRequestWithToken(
        BASE_URL.post,
        path,
        {},
        refreshToken,
      );
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async getStats(type, id) {
    try {
      const path = `/api/like/${type}/${id}/stats`;
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async getArticleInfo(id) {
    try {
      const path = `/api/articles/${id}`;
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async register({ email, password }) {
    try {
      const path = '/api/users';
      const params = {
        name: email,
        fullname: email,
        password: password,
        // dob: null,
      };
      return await BASE_URL.post(path, params);
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async getUserInfoById(id) {
    try {
      const path = `/api/users/${id}`;

      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async changePass(oldPass, newPass, user_id) {
    try {
      const path = `/api/users/${user_id}`;
      const params = {
        password: oldPass,
        new_password: newPass,
      };
      return await privateRequest(BASE_URL.put, path, params);
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async createPlaylist(playlist) {
    try {
      const path = `/api/playlists`;
      return await privateRequest(BASE_URL.post, path, { ...playlist });
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  getSongsOfAlBum(index) {
    return new Promise(resolve => {
      resolve([
        {
          id: '5',
          title: 'Vinahey',
          artist: 'hey hey',
          favorite: false,
          url:
            'https://drive.google.com/uc?export=download&id=1AjPwylDJgR8DOnmJWeRgZzjsohi-7ekj',
          artwork:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
      ]);
    });
  }

  //Lấy danh sách album gần đây
  getPlaylistOfUser() {
    return new Promise(resolve => {
      resolve([
        {
          id: '1',
          name: 'Daily Mixcxxxxxxx 1',
          artist: 'Tim',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
      ]);
    });
  }
}
