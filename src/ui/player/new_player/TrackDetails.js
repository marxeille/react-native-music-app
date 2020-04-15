import React, { Component, useState, useCallback, useEffect } from 'react';

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import { standardPadding } from '../../../utils';
import { indexOf } from 'lodash';
import { rootStore } from '../../../data/context/root_context';
import { likeHelper, unlikeHelper } from '../../../data/datasource/api_helper';
import TextTicker from 'react-native-text-ticker';

const TrackDetails = ({ title, artist, onSharePress, onArtistPress }) => {
  const idExist = indexOf(
    [...rootStore?.likedTracks],
    Number(rootStore?.playerStore?.currentSong?.id),
  );

  const [like, setLike] = useState(idExist >= 0);

  useEffect(() => {
    setLike(idExist >= 0);
  }, [idExist]);

  const onReactionSuccess = useCallback((type, data) => {
    if (type == 'like') {
      if (idExist < 0) {
        rootStore?.addLikedTrack(data);
      }
    } else {
      if (idExist >= 0) {
        rootStore?.removeLikedTrack(data);
      }
    }
  });

  const onReactionError = useCallback((type, data) => {
    setLike(!like);
  });

  const likeTrack = useCallback(async () => {
    await likeHelper(
      'track',
      rootStore?.playerStore?.currentSong?.id,
      onReactionSuccess,
      onReactionError,
    );
  });

  const unlikeTrack = useCallback(async () => {
    await unlikeHelper(
      'track',
      rootStore?.playerStore?.currentSong?.id,
      onReactionSuccess,
      onReactionError,
    );
  });

  const reaction = useCallback(() => {
    setLike(!like);
    !like ? likeTrack() : unlikeTrack();
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={reaction}>
        <Image
          style={styles.button}
          source={like ? Images.ic_like_on : Images.ic_like}
        />
      </TouchableOpacity>
      <View style={styles.detailsWrapper}>
        {/* <LinearGradientText
          text={title}
          end={{ x: 0.7, y: 0 }}
          styles={{
            justifyContent: 'center',
            fontSize: 25,
            fontFamily: 'Averta-ExtraBold',
          }}
        /> */}
        {/* Test */}
        <TextTicker
          style={{ fontSize: 25 }}
          duration={3000}
          loop
          bounce
          repeatSpacer={150}
          scrollSpeed={400}
          bounceSpeed={400}
          marqueeDelay={800}>
          <Text style={styles.title}>{title}</Text>
        </TextTicker>
        {/* end test */}
        <TextTicker
          style={{ fontSize: 25 }}
          duration={3000}
          loop
          bounce
          repeatSpacer={150}
          scrollSpeed={400}
          bounceSpeed={400}
          marqueeDelay={800}>
          <Text style={styles.artist} onPress={onArtistPress}>
            {artist}
          </Text>
        </TextTicker>
      </View>
      <TouchableOpacity onPress={() => onSharePress(false)}>
        <View>
          <Image style={{ marginLeft: 20 }} source={Images.ic_share} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TrackDetails;

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    flexDirection: 'row',
    paddingHorizontal: standardPadding() / 2,
    alignItems: 'center',
  },
  detailsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: '#daa3c9',
    fontSize: 25,
    fontFamily: 'Averta-ExtraBold',
  },
  artist: {
    fontSize: 15,
    marginTop: 4,
    color: '#fff',
    fontFamily: 'lato-regular',
  },
  button: {
    opacity: 0.72,
    marginRight: 20,
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
