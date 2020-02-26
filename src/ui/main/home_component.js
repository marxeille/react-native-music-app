import React, { Component } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { wrap } from '../../themes';
@wrap
export default class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView>
        <View cls="bg-white fullView aic jcc">
          <Text> home_component </Text>
        </View>
      </SafeAreaView>
    );
  }
}
