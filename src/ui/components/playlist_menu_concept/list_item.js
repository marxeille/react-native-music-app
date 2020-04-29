import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { wrap } from '../../../themes';

const ListItem = wrap(({ item }) => {
  return item.picker ? (
    <View cls="pt3">
      <View cls="jcc pv1 ph3 aic">
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
      </View>
    </View>
  ) : (
    <View cls="pt3">
      <TouchableOpacity
        onPress={() => {
          typeof item.action == 'function' ? item.action() : null;
        }}
        cls="jcc pv1 ph3 aic">
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
      </TouchableOpacity>
    </View>
  );
});

export default ListItem;
