import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { wrap } from '../../../themes';
import { RootStore } from '../../../data/repository/root_store';
import { RootContext } from '../../../data/context/root_context';

import LibraryTopBar from './screens/lib_topbar_component';
import LinearGradientText from './components/LinearGradientText';
import LinearGradient from 'react-native-linear-gradient';
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <LinearGradient
          colors={['#291048', '#1a0732', '#130727', '#110426']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View cls="fullView">
            <ImageBackground cls="fullView" source={Images.default_wave_bg}>
              <LinearGradient
                style={{ position: 'absolute' }}
                cls="fullView heightFn-200"
                colors={['#291047', '#1a0632', '#110926', '#110926']}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
              />
              <View cls="flx-i pt4 pa3">
                <LibraryTopBar />
              </View>
            </ImageBackground>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  }
}
