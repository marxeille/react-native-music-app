import React, { useState, useCallback } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import { observer } from 'mobx-react';
import { rootStore } from '../../../data/context/root_context';
import { subLongStr } from '../../../utils';
import GestureRecognizer from 'react-native-swipe-gestures';

const QueueChild = observer(
  wrap(props => {
    const onPlayItem = rootStore.playerStore?.currentSong?.id == props.item?.id;
    const [checked, setChecked] = useState(props.checked);

    const checkedSong = useCallback(() => {
      setChecked(!checked);
      props.onSongCheck(props.item.id);
    });

    return (
      <View
        cls={`pa3 heightFn-${onPlayItem ? '62' : '62'} flx-row jcsb aic ${
          props.isActive ? 'bg-#1c0836' : ''
        } ${onPlayItem ? '' : ''}`}>
        <GestureRecognizer
          onSwipeRight={props.onSwipeRight}
          config={props.config}>
          <View cls="flx-row jcc aic">
            <TouchableOpacity onPress={checkedSong}>
              <Image
                cls="widthFn-24 heightFn-24"
                source={checked ? Images.ic_checked_circle : Images.ic_uncheck}
              />
            </TouchableOpacity>
            <View cls="pl3">
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                cls={`white fw6 f${onPlayItem ? '6' : '6'} latoFont`}>
                {subLongStr(
                  typeof props.item?.getName == 'function'
                    ? props.item?.getName()
                    : props.item?.title,
                  30,
                )}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                cls={`primaryPurple pt1 ${onPlayItem ? '' : ''} latoFont`}>
                {subLongStr(
                  typeof props.item?.getSubTitle == 'function'
                    ? props.item?.getSubTitle()
                    : props.item?.artist,
                  18,
                )}
              </Text>
            </View>
          </View>
        </GestureRecognizer>
        <TouchableOpacity onLongPress={props.drag}>
          <Image source={Images.ic_move} />
        </TouchableOpacity>
      </View>
    );
  }),
);

export default QueueChild;
