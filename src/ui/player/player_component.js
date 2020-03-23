import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  StyleSheet,
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
import { skipToNext, skipToPrevious } from './service/play_service';
import { wrap } from '../../themes';
import { navigate } from '../../navigation/navigation_service';
import SeekBar from './new_player/SeekBar';
import TrackPlayer from 'react-native-track-player';

@observer
@wrap
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
    skipToPrevious();
  }

  onSwipeRight(gestureState) {
    console.log('you swipe right', gestureState);
    skipToNext();
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
    if (rootStore.playerStore.currentSong) {
      return (
        <>
          <GestureRecognizer
            onSwipe={this.onSwipe}
            onSwipeUp={this.onSwipeUp}
            onSwipeDown={this.onSwipeDown}
            onSwipeLeft={this.onSwipeLeft}
            onSwipeRight={this.onSwipeRight}
            config={config}>
            <TouchableHighlight onPress={() => navigate('player')}>
              <View style={styles.container}>
                {/* <View cls="bg-white heightFn-2"></View> */}
                <SeekBar
                  slider={false}
                  trackLength={rootStore?.playerStore?.duration}
                  currentPosition={rootStore?.playerStore?.position}
                />
                <View cls="flx-row fullWidth">
                  <Image
                    source={{
                      uri: rootStore.playerStore.currentSong?.getThumb(),
                    }}
                    cls="widthFn-54 heightFn-54"
                  />

                  <View style={styles.infoSection}>
                    <Text cls="white fw7 lightFont">
                      {rootStore.playerStore.currentSong?.getName()}
                    </Text>
                    <Text cls="primaryPurple f10 fw4 lightFont">
                      {rootStore.playerStore.currentSong?.getSubTitlte()}
                    </Text>
                  </View>
                  <TouchableHighlight
                    onPress={() => {
                      rootStore.playerStore.toggleStatus();
                    }}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    <View cls="pa3 pr2">
                      <Image
                        source={
                          rootStore.playerStore.statusPlayer == 'pause'
                            ? Images.ic_play
                            : Images.ic_pause
                        }
                        cls
                      />
                    </View>
                  </TouchableHighlight>
                  <View cls="pa3">
                    <Image source={Images.ic_like_uncheck} />
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          </GestureRecognizer>
        </>
      );
    } else {
      return null;
    }
  }
}
const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#110027',
  },
  infoSection: {
    height: 54,
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
