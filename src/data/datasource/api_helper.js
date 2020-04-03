//THIS FILE FOR MAKE API SERVICE AND STORES LOOK MORE SIMPLE
//IT'S HANDLE LOGIC FROM TAKING DATA FROM API

import { apiService } from '../context/api_context';

//Reaction refactor
export async function likeHelper(type, id, onSuccess, onError) {
  const like = await apiService.commonApiService.like(type, id);

  if (like.status == 201) {
    if (typeof onSuccess == 'function') onSuccess('like', like.data.entity_id);
  } else {
    if (typeof onError == 'function') onError('like', like.data);
  }
}

export async function unlikeHelper(type, id, onSuccess, onError) {
  const unlike = await apiService.commonApiService.unlike(type, id);
  if (unlike.status == 200) {
    if (typeof onSuccess == 'function') onSuccess('unlike', id);
  } else {
    if (typeof onError == 'function') onError('unlike', unlike.data);
  }
}

//End Reaction refactor

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
  if (tracks.length > 0) {
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
  } else {
    cover = {
      ...cover,
      playlistCover: 'https://picsum.photos/200',
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