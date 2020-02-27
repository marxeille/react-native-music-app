import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableHighlight } from 'react-native';
import Images from '../../assets/icons/icons';
import { RootContext, rootStore } from '../../data/context/root_context'
import { RootStore } from '../../data/repository/root_store';
import { observer } from "mobx-react"
import PlayerStore, { PlayerState } from '../../data/repository/player_store';
import { trace } from "mobx"

@observer
export default class PlayerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    console.log('DEBUG => player_component render');
    trace(true) // enter the debugger whenever an observable value causes this component to re-run
    return (
      <View style={{
        height: 56,
        backgroundColor: '#110027'
      }}>
        <View style={{ height: 2, backgroundColor: 'white' }}>
        </View>
        <View style={{ flex: 1, width: '100%', flexDirection: 'row' }}>
          <Image
            source={{ uri: rootStore.playerStore.currentSong.getThumb() }}
            style={{
              width: 54,
              height: 54,
            }}
          />

          <View style={{ height: 54, flex: 1, paddingVertical: 8, paddingHorizontal: 16 }}>
            <Text style={{ color: 'white', fontSize: 16, fontStyle: 'normal', fontWeight: '600' }}>
              {rootStore.playerStore.currentSong.getName()}
            </Text>
            <Text style={{ color: '#835db8', fontSize: 12, fontStyle: 'normal', fontWeight: '400', }}>
              {rootStore.playerStore.currentSong.getSubTitlte()}
            </Text>
          </View>
          <TouchableHighlight
            onPress={() => {
              rootStore.playerStore.toggleStatus();
            }}
            background={TouchableNativeFeedback.SelectableBackground()}
          >
            <View style={{
              padding: 12
            }}>
              <Image
                source={rootStore.playerStore.statusPlayer == 'pause' ? Images.ic_play : Images.ic_pause}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </View>
          </TouchableHighlight>
          <View style={{
            padding: 12
          }}>
            <Image
              source={Images.ic_favorited}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </View>

        </View>

      </View >
    );
  }
}
