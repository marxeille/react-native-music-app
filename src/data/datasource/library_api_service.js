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
}
