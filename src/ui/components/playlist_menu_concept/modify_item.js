import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { subLongStr } from '../../../utils';
import Images from '../../../assets/icons/icons';
import { wrap } from '../../../themes';

const ModifyItem = wrap(({ item, isActive, drag, removeSong }) => {
  return (
    <View
      cls={`pa3 heightFn-72 flx-row jcsb aic ${isActive ? 'bg-#1c0836' : ''}`}>
      <View cls="flx-row jcc aic">
        <TouchableOpacity
          onPress={() => {
            removeSong(item);
          }}>
          <Image source={Images.ic_minus} />
        </TouchableOpacity>
        <View cls="pl3">
          <Text cls={`white fw6 f6 latoFont`}>
            {subLongStr(item?.title, 30) ?? 'Queue Child'}
          </Text>
          <Text cls={`primaryPurple pt1 latoFont`}>
            {subLongStr(item?.artist, 30) ?? 'Queue Child'}
          </Text>
        </View>
      </View>
      <TouchableOpacity onLongPress={drag}>
        <Image source={Images.ic_move} />
      </TouchableOpacity>
    </View>
  );
});

export default ModifyItem;
