import React, { Component } from 'react';

import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import Images from '../../../assets/icons/icons';
import { observer } from 'mobx-react';
import { wrap } from '../../../themes';
import { standardPadding } from '../../../utils';
import { rootStore } from '../../../data/context/root_context';
function pad(n, width, z = 0) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSeconds = position => [
  pad(Math.floor(position / 60), 2),
  pad(position % 60, 2),
];

const SeekBar = observer(
  wrap(({ trackLength, onSeek, onSlidingStart, slider = true }) => {
    const currentPosition = rootStore?.playerStore?.position;

    const elapsed = minutesAndSeconds(currentPosition);
    const remaining = minutesAndSeconds(trackLength - currentPosition);
    return !slider ? (
      <View cls="flx-row fullWidth heightFn-2">
        <View style={{ flex: currentPosition, backgroundColor: '#d9a2c9' }} />
        <View
          style={{
            flex: trackLength > 1 && trackLength - currentPosition,
            backgroundColor: '#4b3277',
          }}
        />
      </View>
    ) : (
      <View style={styles.container}>
        <Slider
          maximumValue={Math.max(trackLength, 1, currentPosition + 1)}
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSeek}
          value={currentPosition ?? 0}
          style={styles.slider}
          minimumTrackTintColor="#d59fc7"
          maximumTrackTintColor="#4b3277"
          thumbStyle={styles.thumb}
          trackStyle={styles.track}
          thumbImage={Images.ic_circle}
        />
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.text}>{elapsed[0] + ':' + elapsed[1]}</Text>
          <View style={{ flex: 1 }} />
          <Text style={[styles.text, { width: 40, color: '#9166cc' }]}>
            {trackLength > 1 && '-' + remaining[0] + ':' + remaining[1]}
          </Text>
        </View>
      </View>
    );
  }),
);

export default SeekBar;

const styles = StyleSheet.create({
  slider: {},
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  track: {
    height: 2,
    borderRadius: 1,
  },
  thumb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  text: {
    color: '#fff',
    fontFamily: 'lato-regular',
    fontSize: 10,
    textAlign: 'center',
  },
});
