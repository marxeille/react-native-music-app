import React, { Component } from 'react';
import { View, Text } from 'react-native';

//Show thông tin playlist (Thumb, Name)
export default class PlaylistSquareComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClick = () => {
    //Thực hiện khi user click playlist
  };

  render() {
    return (
      <View>
        <Text> playlist_component </Text>
      </View>
    );
  }
}
