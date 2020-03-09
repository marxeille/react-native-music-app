import React, { useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import { wrap } from '../../../themes';
import Slider from '@react-native-community/slider';
import Images from '../../../assets/icons/icons';
import { useProgress } from 'react-native-track-player';
import { observer } from 'mobx-react';
import { PlayerStore } from '../../../data/repository/player_store';
import { rootStore } from '../../../data/context/root_context';

const ProgressBar = observer(
  wrap(props => {
    const progress = useProgress();

    const secondsToMinutes = seconds =>
      Math.floor(seconds / 60) +
      ':' +
      ('0' + Math.floor(seconds % 60)).slice(-2);

    const seekingTo = useCallback(value => {
      props.seekTo(value);
    });

    useEffect(() => {
      if (props.playState == 'pause') {
        rootStore.playerStore.setPosition(progress.position);
        rootStore.playerStore.setDuration(progress.duration);
      }
    }, [props.playState]);

    return props.slider ? (
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
    ) : (
      <View cls="flx-row fullWidth heightFn-2">
        <View style={{ flex: progress.position, backgroundColor: '#d9a2c9' }} />
        <View
          style={{
            flex: progress.duration - progress.position,
            backgroundColor: '#4b3277',
          }}
        />
      </View>
    );
  }),
);

export default ProgressBar;
