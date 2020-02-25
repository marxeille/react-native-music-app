import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class LibraryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Text> library_component </Text>
      </View>
    );
  }
}
