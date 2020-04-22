import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../../assets/icons/icons';
import { subLongStr } from '../../../../utils';
import {
  likeHelper,
  unlikeHelper,
} from '../../../../data/datasource/api_helper';
import { indexOf } from 'lodash';

const ArtistItem = observer(
  wrap(props => {
    const idExist = indexOf(
      [...props.model?.likedTracks],
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
        props.item.id,
        onReactionSuccess,
        onReactionError,
      );
    });

    const unlikeTrack = useCallback(async () => {
      await unlikeHelper(
        'track',
        props.item.id,
        onReactionSuccess,
        onReactionError,
      );
    });

    const reaction = useCallback(() => {
      setLike(!like);
      !like ? likeTrack() : unlikeTrack();
    });

    return (
      <View cls="jcsb flx-row aic pr3" style={{ backgroundColor: '#321a54' }}>
        <View cls="flx-row pa3 pb2 pt2">
          <View cls="squareFn-50 aic jcc">
            <Text cls="white lightFont f5">
              {props.index < 9 ? '0' : ''}
              {props.index + 1}
            </Text>
          </View>

          <View cls="jcc pl3">
            <Text cls="white fw7 f5 lightFont">
              {subLongStr(props.item.getName(), 13)}
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
