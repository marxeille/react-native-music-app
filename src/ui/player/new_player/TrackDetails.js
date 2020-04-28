import React, { Component, useState, useCallback, useEffect } from 'react';

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import { standardPadding } from '../../../utils';
import { indexOf } from 'lodash';
import { rootStore } from '../../../data/context/root_context';
import { likeHelper, unlikeHelper } from '../../../data/datasource/api_helper';
import TextTicker from 'react-native-text-ticker';
import { wrap } from '../../../themes';

const TrackDetails = wrap(({ title, artist, onSharePress, onArtistPress }) => {
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
    <View>
      <View style={styles.standardPadding} cls="flx-row jcsb aic pt3">
        <View>
          <TouchableOpacity onPress={reaction}>
            <Image
              cls="widthFn-24 heightFn-24"
              source={like ? Images.ic_like_on : Images.ic_like}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              onSharePress(true);
            }}>
            <Image source={Images.ic_menu} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => onSharePress(false)}>
            <View>
              <Image source={Images.ic_btn_share} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.detailsWrapper}>
          {title?.length < 20 ? (
            <LinearGradientText
              text={title}
              end={{ x: 0.7, y: 0 }}
              styles={{
                justifyContent: 'center',
                fontSize: 25,
                fontFamily: 'Averta-ExtraBold',
              }}
            />
          ) : (
            <TextTicker
              style={{ fontSize: 25 }}
              duration={6000}
              loop
              bounce
              repeatSpacer={150}
              scrollSpeed={100}
              bounceSpeed={400}
              marqueeDelay={800}>
              <Text style={styles.title}>{title}</Text>
            </TextTicker>
          )}
          <View cls="mt2">
            <TextTicker
              style={{ fontSize: 25 }}
              duration={6000}
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
        </View>
      </View>
    </View>
  );
});

export default TrackDetails;

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    flexDirection: 'row',
    paddingHorizontal: standardPadding() / 2,
    alignItems: 'center',
  },
  standardPadding: { paddingHorizontal: standardPadding() / 2 },
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
    fontSize: 16,
    marginTop: 6,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'lato-heavy',
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
