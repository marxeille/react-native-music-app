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
import Images from '../../../assets/icons/icons';

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
      <View cls="bg-#230c40 fullView">
        <ImageBackground cls="fullView pa3" source={Images.bg3}>
          <View cls="pt4">
            <LinearGradientText
              text={'MYJAM'}
              styles={{
                fontSize: 35,
                fontFamily: 'Averta-ExtraBold',
              }}
            />
          </View>
          <View cls="flx-i pt4">
            <LibraryTopBar />
          </View>
        </ImageBackground>
      </View>
    );
  }
}
