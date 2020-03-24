import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Images from '../../../assets/icons/icons';
import { standardPadding } from '../../../utils';

const Controls = ({
  paused,
  shuffleOn,
  repeatOn,
  onPressPlay,
  onPressPause,
  onBack,
  onForward,
  onPressShuffle,
  onPressRepeat,
  forwardDisabled,
}) => (
  <View style={styles.container}>
    <TouchableOpacity activeOpacity={0.0} onPress={onPressShuffle}>
      <Image
        style={[styles.secondaryControl, shuffleOn ? [] : styles.off]}
        source={Images.ic_shuffle}
      />
    </TouchableOpacity>
    <View style={{ width: 40 }} />
    <TouchableOpacity onPress={onBack}>
      <Image style={styles.changeButton} source={Images.ic_prev} />
    </TouchableOpacity>
    <View style={{ width: 15 }} />
    {!paused ? (
      <TouchableWithoutFeedback onPress={onPressPause}>
        <View>
          <Image source={Images.ic_pause_large} />
        </View>
      </TouchableWithoutFeedback>
    ) : (
      <TouchableWithoutFeedback onPress={onPressPlay}>
        <Image source={Images.ic_play_large} />
      </TouchableWithoutFeedback>
    )}
    <View style={{ width: 15 }} />
    <TouchableOpacity onPress={onForward} disabled={forwardDisabled}>
      <Image
        style={[styles.changeButton, forwardDisabled && { opacity: 0.3 }]}
        source={Images.ic_next}
      />
    </TouchableOpacity>
    <View style={{ width: 40 }} />
    <TouchableOpacity activeOpacity={0.0} onPress={onPressRepeat}>
      <Image
        style={[styles.secondaryControl, repeatOn ? [] : styles.off]}
        source={Images.ic_repeat}
      />
    </TouchableOpacity>
  </View>
);

export default Controls;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16 / standardPadding(),
    paddingHorizontal: standardPadding() / 2,
  },
  playButton: {
    height: 72,
    width: 72,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 72 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryControl: {
    height: 18,
    width: 18,
  },
  changeButton: {
    height: 32,
    width: 32,
  },
  off: {
    opacity: 0.3,
  },
});
