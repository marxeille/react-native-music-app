import React, { Component } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { wrap } from '../../../themes';

@wrap
export default class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView>
        <View cls="bg-white fullView aic jcc">
          <Text> search_component </Text>
        </View>
      </SafeAreaView>
    );
  }
}
