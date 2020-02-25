import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Text> home_component </Text>
      </View>
    );
  }
}
