import React, { Component } from 'react';

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Images from '../../../assets/icons/icons';
import { pop } from '../../../navigation/navigation_service';
import { wrap } from '../../../themes';

const Header = wrap(({ message, onMessagePress }) => (
  <View style={styles.container} cls="aic jcsb">
    <TouchableOpacity onPress={pop}>
      <Image style={styles.icon} source={Images.ic_down} />
    </TouchableOpacity>
    <TouchableOpacity onPress={pop}>
      <Text onPress={onMessagePress} style={styles.message}>
        {message.toUpperCase()}
      </Text>
    </TouchableOpacity>
    <View></View>
  </View>
));

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 72,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  icon: {
    tintColor: '#fff',
  },
  message: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Averta-ExtraBold',
    fontSize: 15,
  },
  button: {
    opacity: 0.72,
  },
});
