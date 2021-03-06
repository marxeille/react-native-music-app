import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../../assets/icons/icons';
import { subLongStr, isSmallDevice } from '../../../../utils';
import {
  likeHelper,
  unlikeHelper,
} from '../../../../data/datasource/api_helper';
import { indexOf } from 'lodash';
import { apiService } from '../../../../data/context/api_context';
import { rootStore } from '../../../../data/context/root_context';

const ArtistItem = observer(
  wrap(props => {
    const idExist = indexOf(
      [...props.model?.likedTracks, ...rootStore.likedTracks],
      Number(props.item.id),
    );
    const [stats, setStats] = useState(0);
    const [like, setLike] = useState(idExist >= 0);
    useEffect(() => {
      setLike(idExist >= 0);
      apiService.commonApiService
        .getStats('track', props.item.id)
        .then(res => {
          if (res.status == 200) setStats(res.data.count);
        })
        .catch(err => console.log(err));
    }, [[...props.model?.likedTracks]]);

    const onReactionSuccess = useCallback((type, data) => {
      if (type == 'like') {
        if (idExist < 0) {
          props.model?.addLikedTrack(data);
        }
      } else {
        if (idExist >= 0) {
          props.model?.removeLikedTrack(data);
        }
      }
    });

    const onReactionError = useCallback((type, data) => {
      setLike(!like);
    });

    const likeTrack = useCallback(async () => {
      await likeHelper(
        'track',
        props.item?.id ?? 0,
        onReactionSuccess,
        onReactionError,
      );
    });

    const unlikeTrack = useCallback(async () => {
      await unlikeHelper(
        'track',
        props.item?.id ?? 0,
        onReactionSuccess,
        onReactionError,
      );
    });

    const reaction = useCallback(() => {
      setLike(!like);
      !like ? likeTrack() : unlikeTrack();
    });

    return (
      <View
        cls="jcsb flx-row aic pr1 br2"
        style={{ backgroundColor: '#321a54' }}>
        <View cls="flx-i flx-wrap pa3 pb2 pt2">
          <View cls="jcc">
            <Text
              cls={`${isSmallDevice() ? 'f8' : 'f6'} white fw7  lightFont`}
              numberOfLines={1}
              ellipsizeMode="tail">
              {props.item && typeof props.item?.getName == 'function'
                ? props.item?.getName()
                : ''}
            </Text>
            <Text
              cls={`${
                isSmallDevice() ? 'f10' : 'f9'
              } primaryPurple  lightFont pt1`}>
              {`${stats.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} `}
            </Text>
          </View>
        </View>
        <View cls="flx-row">
          <TouchableOpacity onPress={reaction}>
            <View cls="widthFn-30 heightFn-50 asfs jcc">
              <Image
                cls={`${
                  like ? 'widthFn-24 heightFn-24' : 'widthFn-26 heightFn-26'
                }`}
                style={{ opacity: like ? 1 : 0.2 }}
                source={like ? Images.ic_like_on : Images.ic_like_uncheck}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.openModal(props.item)}>
            <View cls="widthFn-50 heightFn-50 aic jcc">
              <Image source={Images.ic_menu} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }),
);

export default ArtistItem;
