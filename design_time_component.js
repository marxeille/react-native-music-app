import React, { Component } from 'react';
import { View, Text } from 'react-native';
// import Login from './src/ui/auth/log_in_component';
import LibraryComponent from './src/ui/main/library';

export default class DesignTimeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <LibraryComponent />
      </View>
    );
  }
}
