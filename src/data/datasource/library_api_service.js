import { BASE_URL, privateRequest } from './api_config';
//Hanle data từ Library Api Services
export default class LibraryApiService {
  // Get track basic info
  async getArtists() {
    try {
      const path = `/api/artists`;
      return await privateRequest(BASE_URL.get, path, {});
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
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async likeArtist(artist_id) {
    try {
      const path = '/api/like/artist';
      return await privateRequest(BASE_URL.post, path, {
        entity_id: artist_id,
      });
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async unlikeArtist(artist_id) {
    try {
      const path = `/api/like/artist/${artist_id}`;
      return await privateRequest(BASE_URL.delete, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }
}
