import React, { Component } from 'react';

import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { standardPadding } from '../../../utils';
import Images from '../../../assets/icons/icons';

const AlbumArt = ({ url }) => (
  <View style={styles.container}>
    <Image
      style={styles.image}
      source={url !== '' ? { uri: url } : Images.bAAlbum}
    />
  </View>
);

export default AlbumArt;

const { width } = Dimensions.get('window');
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
