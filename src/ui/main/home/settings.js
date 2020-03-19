import React, { Component } from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { wrap } from '../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../assets/icons/icons';
import { navigate, pop } from '../../../navigation/navigation_service';
import { rootStore, RootContext } from '../../../data/context/root_context';

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
      <ImageBackground cls="fullView aic jcc" source={Images.bg}>
        <TouchableOpacity
          onPress={() => this.context.userStore.removeUserInfo()}>
          <Text cls="white">Logout</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

export default Settings;
