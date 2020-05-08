import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../../assets/icons/icons';
import { subLongStr, isTextEmpty } from '../../../../utils';
import {
  likeHelper,
  unlikeHelper,
} from '../../../../data/datasource/api_helper';
import { indexOf } from 'lodash';
import { rootStore } from '../../../../data/context/root_context';

const AlbumItem = observer(
  wrap(props => {
    const idExist = indexOf(
      [...props.model?.likedTracks, ...rootStore.likedTracks],
      Number(props.item.id),
    );

    const [like, setLike] = useState(idExist >= 0);

    useEffect(() => {
      setLike(idExist >= 0);
    }, [[...props.model?.likedTracks]]);

    const onReactionSuccess = useCallback((type, data) => {
      if (type == 'like') {
        if (idExist < 0) {
          props.model?.addLikedTrack(data);
          rootStore.addLikedTrack(data);
        }
      } else {
        if (idExist >= 0) {
          props.model?.removeLikedTrack(data);
          rootStore.removeLikedTrack(data);
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
        cls="flx-row aic pl3 pr3 pt2 pb2 br2"
        style={{ backgroundColor: '#321a54' }}>
        <Image
          cls="squareFn-50"
          source={
            !isTextEmpty(props.item.getThumb())
              ? {
                  uri: props.item.getThumb(),
                }
              : Images.bAAlbum
          }
        />

        <View cls="flx-i flx-wrap pl3 pr3">
          <View>
            <Text
              cls="white fw7 f6 lightFont"
              numberOfLines={1}
              ellipsizeMode="tail">
              {props.item.getName()}
            </Text>
            <Text
              cls="primaryPurple lightFont"
              numberOfLines={1}
              ellipsizeMode="tail">
              {props.item.getSubTitle()}
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

export default AlbumItem;
