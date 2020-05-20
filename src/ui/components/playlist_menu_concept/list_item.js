import React from 'react';
import { Text, View, TouchableHighlight, Image } from 'react-native';
import { wrap } from '../../../themes';
import { isSmallDevice } from '../../../utils';

const ListItem = wrap(({ item }) => {
  return item.picker ? (
    <View
      cls="br5 ba pa2 fullWidth aic flx-row"
      style={{ borderColor: '#d29dc5' }}>
      <View cls="pl2">
        <Image
          cls={`widthFn-18 heightFn-18 ${item.imgStyle ?? ''}`}
          source={item.icon}
        />
      </View>
      <Text cls="white lightFont pl3">{item.title ?? 'Tuỳ chọn cài đặt'}</Text>
    </View>
  ) : (
    <View cls={`${isSmallDevice() ? 'pt1' : 'pt3'}`}>
      <TouchableHighlight
        activeOpacity={1}
        underlayColor="#7c5994"
        onPress={() => {
          typeof item.action == 'function' ? item.action() : null;
        }}
        cls="jcc br5 ba ml3 mr3 mt2 aic">
        <View
          cls="br5 ba pa2 fullWidth aic flx-row"
          style={{ borderColor: '#d29dc5' }}>
          <View cls="pl2">
            <Image
              cls={`widthFn-18 heightFn-18 ${item.imgStyle ?? ''}`}
              source={item.icon}
            />
          </View>
          <Text cls="white lightFont pl3">
            {item.title ?? 'Tuỳ chọn cài đặt'}
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
});

export default ListItem;
