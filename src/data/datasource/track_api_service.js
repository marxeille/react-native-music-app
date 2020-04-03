import { BASE_URL, privateRequest } from './api_config';
//Hanle data từ Track Api Services
export default class TrackApiService {
  // Get track basic info
  async getTrackInfo(trackId) {
    try {
      const path = `/api/tracks/${trackId}`;
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  // Get track artist info
  async getTrackArtistInfo(trackId) {
    try {
      const path = `/api/tracks/${trackId}/credits`;
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  // Get track url
  async getTrackUrl(trackId) {
    try {
      const path = `/api/file/${trackId}`;
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }

  async getPlaylistInfo(playlistId) {
    try {
      const path = `/api/playlists/${playlistId}`;
      return await privateRequest(BASE_URL.get, path, {});
    } catch (error) {
      console.log('TCL: try -> error', error);
    }
  }
}