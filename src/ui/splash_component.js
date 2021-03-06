import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { RootContext } from '../data/context/root_context';

export default class SplashComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static contextType = RootContext;

  componentDidMount() {
    let value = this.context;
    var userStore = value.userStore;
    userStore.checkAuthStateAndConfig();
  }

  render() {
    console.log('DEBUG => splash_component ');
    return (
      <RootContext.Consumer>
        {value => (
          <View
            style={{
              alignItems: 'center',
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            <ActivityIndicator />
          </View>
        )}
      </RootContext.Consumer>
    );
  }
}
