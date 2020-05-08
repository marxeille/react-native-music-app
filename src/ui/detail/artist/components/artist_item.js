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

const ArtistItem = observer(
  wrap(props => {
    const idExist = indexOf(
      [...props.model?.likedTracks],
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
        cls="jcsb flx-row aic pr3 br2"
        style={{ backgroundColor: '#321a54' }}>
        <View cls="flx-i flx-wrap pa3 pb2 pt2">
          <View cls="jcc">
            <Text
              cls={`${isSmallDevice() ? 'f8' : 'f6'} white fw7  lightFont`}
              numberOfLines={1}
              ellipsizeMode="tail">
              {props.item.getName()}
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
          <TouchableOpacity cls="pr3" onPress={reaction}>
            <Image
              style={{ opacity: like ? 1 : 0.2 }}
              source={like ? Images.ic_like_on : Images.ic_like_uncheck}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.openModal(props.item)}>
            <Image source={Images.ic_menu} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }),
);

export default ArtistItem;
