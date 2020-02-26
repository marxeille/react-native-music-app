import React, { Component } from 'react';
import { View, Text, SafeAreaView, Button } from 'react-native';
import { navigate } from '../../navigation/navigation_service'
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
          <Button
            title="Open Player"
            onPress={() => {
              navigate('player');
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
