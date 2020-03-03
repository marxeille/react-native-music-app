import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  TouchableHighlight,
} from 'react-native';
import Images from '../../assets/icons/icons';
import { RootContext, rootStore } from '../../data/context/root_context';
import { RootStore } from '../../data/repository/root_store';
import { observer } from 'mobx-react';
import PlayerStore, { PlayerState } from '../../data/repository/player_store';
import { trace } from 'mobx';
import GestureRecognizer, {
  swipeDirections,
} from 'react-native-swipe-gestures';

@observer
export default class PlayerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSwipeUp(gestureState) {
    console.log('you swipe up', gestureState);
  }

  onSwipeDown(gestureState) {
    console.log('you swipe down', gestureState);
  }

  onSwipeLeft(gestureState) {
    console.log('you swipe left', gestureState);
  }

  onSwipeRight(gestureState) {
    console.log('you swipe right', gestureState);
  }

  onSwipe(gestureName, gestureState) {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    switch (gestureName) {
      case SWIPE_UP:
        console.log('you SWIPE_UP right', gestureState);
        break;
      case SWIPE_DOWN:
        console.log('you SWIPE_DOWN right', gestureState);
        break;
      case SWIPE_LEFT:
        console.log('you SWIPE_LEFT right', gestureState);
        break;
      case SWIPE_RIGHT:
        console.log('you SWIPE_RIGHT right', gestureState);
        break;
    }
  }

  render() {
    console.log('DEBUG => player_component render');
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    return (
      <>
        <GestureRecognizer
          onSwipe={this.onSwipe}
          onSwipeUp={this.onSwipeUp}
          onSwipeDown={this.onSwipeDown}
          onSwipeLeft={this.onSwipeLeft}
          onSwipeRight={this.onSwipeRight}
          config={config}>
          <View
            style={{
              height: 56,
              backgroundColor: '#110027',
            }}>
            <View style={{ height: 2, backgroundColor: 'white' }}></View>
            <View style={{ flex: 1, width: '100%', flexDirection: 'row' }}>
              <Image
                source={{ uri: rootStore.playerStore.currentSong.getThumb() }}
                style={{
                  width: 54,
                  height: 54,
                }}
              />

              <View
                style={{
                  height: 54,
                  flex: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: '600',
                  }}>
                  {rootStore.playerStore.currentSong.getName()}
                </Text>
                <Text
                  style={{
                    color: '#835db8',
                    fontSize: 12,
                    fontStyle: 'normal',
                    fontWeight: '400',
                  }}>
                  {rootStore.playerStore.currentSong.getSubTitlte()}
                </Text>
              </View>
              <TouchableHighlight
                onPress={() => {
                  rootStore.playerStore.toggleStatus();
                }}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View
                  style={{
                    padding: 12,
                  }}>
                  <Image
                    source={
                      rootStore.playerStore.statusPlayer == 'pause'
                        ? Images.ic_play
                        : Images.ic_pause
                    }
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  rootStore.playerStore.currentSong.toggleFavorite();
                }}>

                <View
                  style={{
                    padding: 12,
                  }}>
                  <Image
                    source={rootStore.playerStore.currentSong.isFavorite() ? Images.ic_favorited : Images.ic_favorite}
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </GestureRecognizer>
      </>
    );
  }
}
