import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { wrap } from '../../../../themes';
import SearchComponent from '../components/search_component';

@wrap
export default class artistComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View cls="pt3">
        <Text cls="white"> artist </Text>
        <SearchComponent />
      </View>
    );
  }
}
