import React, { Component } from 'react';
import { View, Text } from 'react-native';

//Show track hiện tại đang phát (Thum, Name, Artist, pause/play, Next, Back)
export default class PlayerControllerCompoenent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  togglePlayPause = () => {

  }

  next = () => {

  }


  render() {
    return (
      <View style={{
        height: 56,
      }}>
        <Text> player_controller_component </Text>
      </View>
    );
  }
}
