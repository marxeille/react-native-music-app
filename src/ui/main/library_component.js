import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { wrap } from '../../themes';
import { RootStore } from '../../data/repository/root_store';
import { RootContext } from '../../data/context/root_context';
import LinearGradient from 'react-native-linear-gradient';
import { Styles } from '../../styles/stylesheets';

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
      <LinearGradient colors={['#321b54', '#240e41', '#15002e']} style={Styles.linearGradient}>
        <SafeAreaView>
          <View cls="fullView aic jcc">
            <Text> lib_component </Text>
            <TouchableOpacity
              onPress={() => {
                value.userStore.removeUserInfo();
              }}>
              <Text> logout </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}
