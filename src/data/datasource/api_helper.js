import { apiService } from '../context/api_context';

export async function getTrackFullDetail(trackId) {
  const [trackInfo, trackUrl, trackArtist] = await Promise.all([
    new Promise(async resolve => {
      try {
        const result = await apiService.trackApiService.getTrackInfo(trackId);
        resolve(result?.data || null);
      } catch (error) {
        resolve(null);
      }
    }),
    new Promise(async resolve => {
      try {
        const result = await apiService.trackApiService.getTrackUrl(trackId);
        resolve(result?.data || null);
      } catch (error) {
        reject();
      }
    }),
    new Promise(async resolve => {
      try {
        const result = await apiService.trackApiService.getTrackArtistInfo(
          trackId,
        );
        resolve(result?.data || null);
      } catch (error) {
        resolve(null);
      }
    }),
  ]);

  return { ...trackInfo, ...trackUrl, ...trackArtist };
}

export async function getPlaylistCover(tracks) {
  let artists = [];
  let cover = { playlistCover: '', artists: '' };
  const trackCover = await apiService.trackApiService.getTrackInfo(
    tracks[0].track_id,
  );
  if (trackCover.status == 200) {
    cover = {
      ...cover,
      playlistCover:
        trackCover?.data?.cover_path ??
        'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BBVzjuG.img?h=597&w=660&m=6&q=60&o=f&l=f&x=300&y=232',
    };
  }

  tracks.map(async (track, index) => {
    if (index < 2) {
      const artist = await apiService.trackApiService.getTrackArtistInfo(
        track.track_id,
      );
      if (artist.data.length > 0 && artist.status == 200) artists.push(artist);
    }
  });

  cover = {
    ...cover,
    artists: artists.length > 0 ? artists.join(',') : 'Chưa xác định',
  };

  return cover;
}
