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
        cls={`pa3 heightFn-${onPlayItem ? '84' : '72'} flx-row jcsb aic ${
          props.isActive ? 'bg-#1c0836' : ''
        } ${onPlayItem ? 'bb b--#d59fc6' : ''}`}>
        <GestureRecognizer
          onSwipeRight={props.onSwipeRight}
          config={props.config}>
          <View cls="flx-row jcc aic">
            <TouchableOpacity onPress={checkedSong}>
              <Image
                source={checked ? Images.ic_checked_circle : Images.ic_uncheck}
              />
            </TouchableOpacity>
            <View cls="pl3">
              <Text cls={`white fw6 f${onPlayItem ? '4' : '6'} latoFont`}>
                {subLongStr(props.item?.getName(), 18) ?? 'Queue Child'}
              </Text>
              <Text
                cls={`primaryPurple pt1 ${onPlayItem ? 'f6' : ''} latoFont`}>
                {props.item?.getSubTitle() ?? 'Queue Child'}
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
