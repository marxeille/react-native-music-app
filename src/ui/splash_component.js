import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class SplashComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Text> splash_component </Text>
      </View>
    );
  }
}
