import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PlayerControllerCompoenent from './src/ui/components/player_controller_component'

export default class DesignTimeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <PlayerControllerCompoenent/>
      </View>
    );
  }
}
