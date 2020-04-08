import React, { useCallback } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';
import { wrap } from '../../../themes';
import PropTypes from 'prop-types';
import Images from '../../../assets/icons/icons';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import PlayerInfo from './player_info';
import ProgressBar from './progessbar';

const react_native_1 = require('react-native');
const TrackPlayerState = react_native_1.NativeModules.TrackPlayerModule;

const Player = wrap(props => {
  const playbackState = usePlaybackState();

  // const [trackArtist, setTrackArtist] = useState('');

  // useTrackPlayerEvents(['playback-track-changed'], async event => {
  //   if (event.type === 'playback-track-changed') {
  //     const track = await TrackPlayer.getTrack(event.nextTrack);
  //     setTrackTitle(track.title);
  //     setTrackArtist(track.artist);
  //     setTrackArtwork(track.artwork);
  //   }
  // });

  const { onNext, onPrevious, onTogglePlayback, onSeek } = props;

  let playState = 'pause';

  if (playbackState === TrackPlayerState.STATE_PLAYING) {
    playState = 'play';
  }

  const handleTogglePlay = useCallback(() => {
    onTogglePlayback();
  });

  const renderPlaySection = useCallback(
    wrap(() => {
      return (
        <View>
          <View cls="flx-row jcsa aic pt2">
            <TouchableOpacity onPress={() => {}}>
              <Image source={Images.ic_shuffle} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPrevious}>
              <Image source={Images.ic_prev} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTogglePlay}>
              <Image
                source={
                  playState == 'play'
                    ? Images.ic_pause_large
                    : Images.ic_play_large
                }
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onNext}>
              <Image cls="widthFn-32 heightFn-32" source={Images.ic_next} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Image source={Images.ic_repeat} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }),
  );

  return (
    <View>
      <PlayerInfo />
      <ProgressBar slider seekTo={onSeek} playState={playState} />
      {renderPlaySection()}
    </View>
    //   <Image style={styles.cover} source={{ uri: trackArtwork }} />
  );
});

Player.propTypes = {
  style: ViewPropTypes.style,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onTogglePlayback: PropTypes.func.isRequired,
};

Player.defaultProps = {
  style: {},
};

export default Player;
