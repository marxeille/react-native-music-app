import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { wrap } from '../../../themes';
import { RootStore } from '../../../data/repository/root_store';
import { RootContext } from '../../../data/context/root_context';

import LibraryTopBar from './screens/lib_topbar_component';
import LinearGradientText from './components/LinearGradientText';

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
      <ImageBackground
        cls="fullView pa3"
        source={require('../../../assets/icons/bg.png')}>
        <View cls="pt4">
          <LinearGradientText
            text={'MYJAM'}
            styles={{ fontWeight: '700', fontSize: 28 }}
          />
        </View>
        <View cls="flx-i pt3">
          <LibraryTopBar />
        </View>
      </ImageBackground>
    );
  }
}
