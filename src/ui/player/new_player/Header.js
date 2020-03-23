import React, { Component } from 'react';

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Images from '../../../assets/icons/icons';
import { pop } from '../../../navigation/navigation_service';
import { wrap } from '../../../themes';

const Header = wrap(
  ({ message, onDownPress, onQueuePress, onMessagePress }) => (
    <View style={styles.container} cls="aic jcsb">
      <TouchableOpacity onPress={pop}>
        <Image source={Images.ic_down} />
      </TouchableOpacity>
      <TouchableOpacity onPress={pop}>
        <Text onPress={onMessagePress} style={styles.message}>
          {message.toUpperCase()}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onQueuePress}>
        <Image source={Images.ic_menu} />
      </TouchableOpacity>
    </View>
  ),
);

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 72,
    paddingHorizontal: 24,
    flexDirection: 'row',
  },
  message: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Averta-ExtraBold',
    fontSize: 16,
  },
  button: {
    opacity: 0.72,
  },
});
