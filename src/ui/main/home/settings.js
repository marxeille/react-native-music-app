import React, { Component } from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { wrap } from '../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../assets/icons/icons';
import { navigate, pop } from '../../../navigation/navigation_service';
import { rootStore, RootContext } from '../../../data/context/root_context';
import LinearGradient from 'react-native-linear-gradient';

@observer
@wrap
class Settings extends Component {
  static contextType = RootContext;
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <LinearGradient
        colors={['#291048', '#1f0d36', '#130727', '#110426']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View cls="fullView">
          <ImageBackground cls="fullView aic jcc" source={Images.bg3}>
            <TouchableOpacity
              onPress={() => this.context.userStore.removeUserInfo()}>
              <Text cls="white">Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pop()}>
              <Text cls="white">Go back</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </LinearGradient>
    );
  }
}

export default Settings;
