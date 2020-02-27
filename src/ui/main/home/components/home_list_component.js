import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { wrap } from '../../../themes';

@wrap
export default class HomeListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderSmallItem = wrap(item => {
    return (
      <View cls="widthFn-111 pl3 mr2">
        <Image
          cls="heightFn-111 widthFn-111"
          source={require('../../../assets/images/cover3.png')}
        />
        <Text cls="white pt2 fw5">Daily mix 1</Text>
      </View>
    );
  });

  renderLargeItem = wrap(item => {});

  render() {
    return (
      <View>
        <Text> HomeListComponent </Text>
      </View>
    );
  }
}
