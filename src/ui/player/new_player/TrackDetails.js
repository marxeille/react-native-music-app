import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../../main/library/components/LinearGradientText';

const TrackDetails = ({
  title,
  artist,
  onAddPress,
  onSharePress,
  onTitlePress,
  onArtistPress,
}) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onAddPress}>
      <Image style={styles.button} source={Images.ic_like} />
    </TouchableOpacity>
    <View style={styles.detailsWrapper}>
      <LinearGradientText
        text={title}
        end={{ x: 0.7, y: 0 }}
        styles={{
          justifyContent: 'center',
          fontSize: 25,
          fontFamily: 'Averta-ExtraBold',
        }}
      />
      <Text style={styles.artist} onPress={onArtistPress}>
        {artist}
      </Text>
    </View>
    <TouchableOpacity onPress={onSharePress}>
      <View>
        <Image source={Images.ic_share} />
      </View>
    </TouchableOpacity>
  </View>
);

export default TrackDetails;

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    flexDirection: 'row',
    paddingLeft: 20,
    alignItems: 'center',
    paddingRight: 20,
  },
  detailsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  artist: {
    fontSize: 15,
    marginTop: 4,
    color: '#fff',
    fontFamily: 'lato-regular',
  },
  button: {
    opacity: 0.72,
  },
  moreButton: {
    borderColor: 'rgb(255, 255, 255)',
    borderWidth: 2,
    opacity: 0.72,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonIcon: {
    height: 17,
    width: 17,
  },
});
