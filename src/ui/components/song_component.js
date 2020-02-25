import React, { Component } from 'react';
import { View, Text } from 'react-native';

//Show thông tin bài hát: Thumb, Name, Artist
export default class SongComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Text> song_component </Text>
      </View>
    );
  }
}
