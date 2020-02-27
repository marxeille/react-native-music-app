import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { wrap } from '../../../themes';
import { RootStore } from '../../../data/repository/root_store';
import { RootContext } from '../../../data/context/root_context';

@wrap
export default class LibraryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static contextType = RootContext;

  render() {
    let value = this.context;
    return (
      <SafeAreaView>
        <View cls="bg-white fullView aic jcc">
          <Text> lib_component </Text>
          <TouchableOpacity
            onPress={() => {
              value.userStore.removeUserInfo();
            }}>
            <Text> logout </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
