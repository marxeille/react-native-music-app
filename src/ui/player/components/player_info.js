import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react';
import { rootStore } from '../../../data/context/root_context';

@observer
export default class PlayerInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{
        backgroundColor: '#CCC',
        height: 56
      }}>
        <Text >{rootStore.playerStore.currentSong?.getName()}</Text>
        <Text >{rootStore.playerStore.currentSong?.getSubTitlte()}</Text>
      </View>
    );
  }
}
