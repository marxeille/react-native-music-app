import TrackPlayer, { usePlaybackState } from 'react-native-track-player';

export async function skipToNext() {
  try {
    await TrackPlayer.skipToNext();
  } catch (_) {}
}

export async function skipToPrevious() {
  try {
    await TrackPlayer.skipToPrevious();
  } catch (_) {}
}

export async function checkQueue() {
  const queue = await TrackPlayer.getQueue();
  const currentTrack = await TrackPlayer.getCurrentTrack();
  console.log('current', parseInt(currentTrack));

  if (
    parseInt(currentTrack) < parseInt(queue[0].id) ||
    parseInt(currentTrack) > parseInt(queue[queue.length - 1].id)
  ) {
    console.log(
      'something get here',
      parseInt(currentTrack),
      parseInt(queue[0].id),
      parseInt(queue[queue.length - 1].id),
    );
  }
}
