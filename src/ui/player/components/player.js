import React, { useState, useCallback } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';
import { wrap } from '../../../themes';
import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';
import Images from '../../../assets/icons/icons';
import TrackPlayer, {
  useProgress,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { subLongStr, isSmallDevice } from '../../../utils';
import LinearGradientText from '../../main/library/components/LinearGradientText';

const react_native_1 = require('react-native');
const TrackPlayerState = react_native_1.NativeModules.TrackPlayerModule;

const ProgressBar = wrap(props => {
  const progress = useProgress();

  const secondsToMinutes = seconds =>
    Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);

  const seekingTo = useCallback(value => {
    props.seekTo(value);
  });

  return (
    <View cls="pa3">
      <Slider
        cls="fullWidth"
        value={progress.position}
        minimumValue={0}
        maximumValue={progress.duration}
        onSlidingComplete={value => seekingTo(value)}
        minimumTrackTintColor="#d59fc7"
        maximumTrackTintColor="#4b3277"
        thumbImage={Images.ic_circle}
      />
      <View cls="flx-row jcsb">
        <Text cls="white f11">{secondsToMinutes(progress.position)}</Text>
        <Text cls="white f11">
          -{secondsToMinutes(progress.duration - progress.position)}
        </Text>
      </View>
    </View>
    // <View style={styles.progress}>
    //   <View style={{ flex: progress.position, backgroundColor: 'red' }} />
    //   <View
    //     style={{
    //       flex: progress.duration - progress.position,
    //       backgroundColor: 'grey',
    //     }}
    //   />
    // </View>
  );
});

// function ControlButton({ title, onPress }) {
//   return (
//     <TouchableOpacity style={styles.controlButtonContainer} onPress={onPress}>
//       <Text style={styles.controlButtonText}>{title}</Text>
//     </TouchableOpacity>
//   );
// }

// ControlButton.propTypes = {
//   title: PropTypes.string.isRequired,
//   onPress: PropTypes.func.isRequired,
// };

const Player = wrap(props => {
  const playbackState = usePlaybackState();
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtwork, setTrackArtwork] = useState('');
  const [trackArtist, setTrackArtist] = useState('');

  useTrackPlayerEvents(['playback-track-changed'], async event => {
    if (event.type === 'playback-track-changed') {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      setTrackTitle(track.title);
      setTrackArtist(track.artist);
      setTrackArtwork(track.artwork);
    }
  });

  const { onNext, onPrevious, onTogglePlayback, onSeek } = props;

  let playState = 'play';

  if (
    playbackState === TrackPlayerState.STATE_PLAYING ||
    playbackState === TrackPlayerState.STATE_BUFFERING
  ) {
    playState = 'pause';
  }

  const handleTogglePlay = useCallback(() => {
    onTogglePlayback();
  });

  const renderInfo = useCallback(
    wrap(() => {
      return (
        <View>
          <View cls={`flx-row jcsa aic pt${isSmallDevice() ? 4 : 5}`}>
            <TouchableOpacity onPress={() => {}}>
              <Image source={Images.ic_like} />
            </TouchableOpacity>
            <TouchableOpacity>
              <LinearGradientText
                text={subLongStr(`${trackTitle} hey hey hey`, 20)}
                end={{ x: 0.7, y: 0 }}
                styles={{
                  justifyContent: 'center',
                  fontSize: 23,
                  fontWeight: '800',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={Images.ic_share} />
            </TouchableOpacity>
          </View>
          <Text cls="white pt2 asc f7">Idol {trackArtist} bẢnH</Text>
        </View>
      );
    }),
  );

  const renderPlaySection = useCallback(
    wrap(() => {
      return (
        <View>
          <View cls="flx-row jcsa aic pt2">
            <TouchableOpacity onPress={() => {}}>
              <Image cls="widthFn-20 heightFn-20" source={Images.ic_shuffe} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPrevious}>
              <Image cls="widthFn-32 heightFn-32" source={Images.ic_prev} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTogglePlay}>
              <Image
                source={
                  playState == 'pause'
                    ? Images.ic_pause_large
                    : Images.ic_play_large
                }
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onNext}>
              <Image cls="widthFn-32 heightFn-32" source={Images.ic_next} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Image cls="widthFn-18 heightFn-18" source={Images.ic_repeat} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }),
  );

  return (
    <View>
      {renderInfo()}
      <ProgressBar seekTo={onSeek} />
      {renderPlaySection()}
    </View>
    // <View style={[styles.card, style]}>
    //   <Image style={styles.cover} source={{ uri: trackArtwork }} />
    //   <ProgressBar />
    //   <Text style={styles.title}>{trackTitle}</Text>
    //   <Text style={styles.artist}>{trackArtist}</Text>
    //   <View style={styles.controls}>
    //     <ControlButton title={'<<'} onPress={onPrevious} />
    //     <ControlButton title={middleButtonText} onPress={handleTogglePlay} />
    //     <ControlButton title={'>>'} onPress={onNext} />
    //   </View>
    // </View>
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
