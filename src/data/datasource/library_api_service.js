import { BASE_URL, privateRequest } from './api_config';
//Hanle data từ Library Api Services
export default class LibraryApiService {
  // Get track basic info
  async getArtists(ids) {
    try {
      const path = `/api/artists`;
      const params = ids
        ? {
            ids: ids.join(','),
          }
        : {};
      return await privateRequest(BASE_URL.get, path, params);
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }
  async getArtistTracks(artist_id) {
    try {
      const path = `/api/artists/${artist_id}/tracks`;
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async getLikedArtists() {
    try {
      const path = '/api/like/artist';
      return await privateRequest(BASE_URL.get, path, { per_page: 50 });
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async getLikedAlbums() {
    try {
      const path = '/api/like/article';
      return await privateRequest(BASE_URL.get, path, { per_page: 50 });
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async getAlbums() {
    try {
      const path = `/api/articles`;
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }
}
