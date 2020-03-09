import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';

const QueueChild = wrap(({ checked }) => (
  <View cls="heightFn-72 flx-row jcsb aic">
    <View cls="flx-row jcc aic">
      <TouchableOpacity>
        <Image source={checked ? Images.ic_checked : Images.ic_uncheck} />
      </TouchableOpacity>
      <View cls="pl3">
        <Text cls="white fw6 f6">Queue Child</Text>
        <Text cls="primaryPurple pt1">Queue Child</Text>
      </View>
    </View>
    <TouchableOpacity>
      <Image source={Images.ic_move} />
    </TouchableOpacity>
  </View>
));

export default QueueChild;
