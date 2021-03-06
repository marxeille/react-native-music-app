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
        cls="flx-row aic pl2 pt2 pb2 br2 jcsb"
        style={{ backgroundColor: '#321a54' }}>
        <View style={{ flex: 3 }}>
          <TouchableOpacity onPress={() => props.playSong(props.item)}>
            <View cls="flx-row">
              <Image
                cls="squareFn-50"
                source={
                  !isTextEmpty(
                    props.item && typeof props.item?.getThumb == 'function'
                      ? props.item?.getThumb()
                      : '',
                  )
                    ? {
                        uri: props.item?.getThumb(),
                      }
                    : Images.bAAlbum
                }
              />

              <View cls="flx-wrap flx-i pl3 pr1 aic jcc">
                <View>
                  <Text
                    cls="white fw7 f6 lightFont"
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {props.item && typeof props.item?.getName == 'function'
                      ? subLongStr(props.item?.getName(), 40)
                      : ''}
                  </Text>
                  <Text
                    cls="primaryPurple lightFont"
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {props.item && typeof props.item?.getSubTitle == 'function'
                      ? props.item.getSubTitle()
                      : ''}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View cls="flx-row asfe flx-i">
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

export default AlbumItem;
