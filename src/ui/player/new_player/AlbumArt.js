import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { standardPadding } from '../../../utils';

const AlbumArt = ({ url, onPress }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onPress}>
      <Image style={styles.image} source={{ uri: url }} />
    </TouchableOpacity>
  </View>
);

export default AlbumArt;

const { width, height } = Dimensions.get('window');
const imageSize = width - standardPadding();

const styles = StyleSheet.create({
  bg: { width: '100%' },
  container: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  image: {
    width: imageSize,
    height: imageSize,
  },
});
