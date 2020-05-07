import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Images from '../../../assets/icons/icons';
import { standardPadding } from '../../../utils';
import { wrap } from '../../../themes';

const Controls = wrap(
  ({
    paused,
    shuffleOn,
    repeatOn,
    repeatOneOn,
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
          cls="widthFn-22"
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
            <Image source={Images.ic_btn_pause2} />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={onPressPlay}>
          <Image source={Images.ic_btn_play2} />
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
      <TouchableOpacity
        cls="flx-row aic jcc"
        activeOpacity={0.0}
        onPress={onPressRepeat}>
        <Image
          cls="widthFn-22"
          style={[
            styles.secondaryControl,
            repeatOn || repeatOneOn ? [] : styles.off,
          ]}
          source={repeatOneOn ? Images.ic_repeat_one : Images.ic_repeat}
        />
      </TouchableOpacity>
    </View>
  ),
);

export default Controls;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16 / standardPadding(),
    paddingHorizontal: 16,
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
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  changeButton: {
    height: 24,
    width: 24,
  },
  off: {
    opacity: 0.9,
    tintColor: '#9166cc',
  },
});
