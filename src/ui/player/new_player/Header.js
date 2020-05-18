import React, { Component } from 'react';

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Images from '../../../assets/icons/icons';
import { pop } from '../../../navigation/navigation_service';
import { wrap } from '../../../themes';
import TextTicker from 'react-native-text-ticker';

const Header = wrap(({ message, onMessagePress }) => (
  <View style={styles.container} cls="aic jcsb">
    <View cls="flx-i">
      <TouchableOpacity onPress={pop}>
        <View cls="widthFn-50 heightFn-50 jcc">
          <Image style={styles.icon} source={Images.ic_down} />
        </View>
      </TouchableOpacity>
    </View>
    <View style={{ flex: 3 }}>
      <TouchableOpacity onPress={pop}>
        <TextTicker
          style={{ fontSize: 15 }}
          duration={12000}
          loop
          bounce
          repeatSpacer={150}
          scrollSpeed={100}
          bounceSpeed={400}
          marqueeDelay={800}>
          <Text onPress={onMessagePress} style={styles.message}>
            {message.toUpperCase()}
          </Text>
        </TextTicker>
      </TouchableOpacity>
    </View>
    <View cls="flx-i" />
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
    alignItems: 'center',
    color: '#fff',
    fontFamily: 'Averta-ExtraBold',
    fontSize: 15,
  },
  button: {
    opacity: 0.72,
  },
});
