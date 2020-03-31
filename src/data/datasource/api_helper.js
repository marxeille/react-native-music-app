//THIS FILE FOR MAKE API SERVICE AND STORES LOOK MORE SIMPLE
//IT'S HANDLE LOGIC FROM TAKING DATA FROM API

import { apiService } from '../context/api_context';

export async function likeTrackHelper(trackId, onSuccess, onError) {
  const like = await apiService.commonApiService.likeTrack(trackId);

  if (like.status == 201) {
    if (typeof onSuccess == 'function') onSuccess('like', like.data.entity_id);
  } else {
    if (typeof onError == 'function') onError('like', like.data);
  }
}

export async function unlikeTrackHelper(trackId, onSuccess, onError) {
  const unlike = await apiService.commonApiService.unlikeTrack(trackId);
  if (unlike.status == 200) {
    if (typeof onSuccess == 'function') onSuccess('unlike', trackId);
  } else {
    if (typeof onError == 'function') onError('unlike', unlike.data);
  }
}

export async function likeArtistHelper(artistId, onSuccess, onError) {
  const like = await apiService.libraryApiService.likeArtist(artistId);

  if (like.status == 201) {
    if (typeof onSuccess == 'function') onSuccess('like', like.data.entity_id);
  } else {
    if (typeof onError == 'function') onError('like', like.data);
  }
}

export async function unlikeArtistHelper(artistId, onSuccess, onError) {
  const unlike = await apiService.libraryApiService.unlikeArtist(artistId);
  if (unlike.status == 200) {
    if (typeof onSuccess == 'function') onSuccess('unlike', artistId);
  } else {
    if (typeof onError == 'function') onError('unlike', unlike.data);
  }
}

export async function getTrackFullDetail(trackId) {
  const [trackUrl, trackArtist] = await Promise.all([
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

  return { ...trackUrl, ...trackArtist };
}

export async function getPlaylistCover(tracks) {
  let artists = [];
  let cover = {};
  // Get first track cover for playlist cover
  const trackCover = await apiService.trackApiService.getTrackInfo(
    tracks[0].track_id,
  );
  if (trackCover.status == 200) {
    cover = {
      ...cover,
      playlistCover:
        trackCover?.data?.cover_path ?? 'https://picsum.photos/200',
    };
  }

  // Get 2 track artists for playlist artists
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
