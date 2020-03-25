import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import { observer } from 'mobx-react';
import { rootStore } from '../../../data/context/root_context';

const QueueChild = observer(
  wrap(props => {
    const onPlayItem = rootStore.playerStore?.currentSong?.id == props.item?.id;
    return (
      <View
        cls={`pa3 heightFn-${onPlayItem ? '84' : '72'} flx-row jcsb aic ${
          props.isActive ? 'bg-#1c0836' : ''
        } ${onPlayItem ? 'bb b--#d59fc6' : ''}`}>
        <View cls="flx-row jcc aic">
          <TouchableOpacity>
            <Image
              source={
                // rootStore.playerStore?.currentSong?.id == props.item?.id
                //   ? Images.ic_checked :
                Images.ic_uncheck
              }
            />
          </TouchableOpacity>
          <View cls="pl3">
            <Text cls={`white fw6 f${onPlayItem ? '4' : '6'} latoFont`}>
              {props.item?.getName() ?? 'Queue Child'}
            </Text>
            <Text cls={`primaryPurple pt1 ${onPlayItem ? 'f6' : ''} latoFont`}>
              {props.item?.getSubTitlte() ?? 'Queue Child'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onLongPress={props.drag}>
          <Image source={Images.ic_move} />
        </TouchableOpacity>
      </View>
    );
  }),
);

export default QueueChild;
