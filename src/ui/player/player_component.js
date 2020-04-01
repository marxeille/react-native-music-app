import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Images from '../../assets/icons/icons';
import { rootStore } from '../../data/context/root_context';
import { observer } from 'mobx-react';
import GestureRecognizer, {
  swipeDirections,
} from 'react-native-swipe-gestures';
import { wrap } from '../../themes';
import { navigate } from '../../navigation/navigation_service';
import SeekBar from './new_player/SeekBar';
import { indexOf } from 'lodash';
import { likeHelper, unlikeHelper } from '../../data/datasource/api_helper';

@observer
@wrap
export default class PlayerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSwipeUp() {
    navigate('player');
  }

  onSwipeDown(gestureState) {
    console.log('you swipe down', gestureState);
  }

  onSwipeLeft() {
    if (
      rootStore.playerStore?.trackIndex <
      rootStore.playerStore?.getQueueSize() - 1
    ) {
      rootStore.playerStore?.changeSong('next');
    }
  }

  onSwipeRight() {
    if (rootStore.playerStore?.trackIndex > 0) {
      rootStore.playerStore?.changeSong('back');
    }
  }

  onSwipe(gestureName, gestureState) {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    switch (gestureName) {
      case SWIPE_UP:
        break;
      case SWIPE_DOWN:
        break;
      case SWIPE_LEFT:
        break;
      case SWIPE_RIGHT:
        break;
    }
  }

  onReactionSuccess = (type, data) => {
    const idExist = indexOf(
      [...rootStore?.likedTracks],
      Number(rootStore?.playerStore?.currentSong?.id),
    );
    if (type == 'like') {
      if (idExist < 0) {
        rootStore?.addLikedTrack(data);
      }
    } else {
      if (idExist >= 0) {
        rootStore?.removeLikedTrack(data);
      }
    }
  };

  likeTrack = async () => {
    await likeHelper(
      'track',
      rootStore?.playerStore?.currentSong?.id,
      this.onReactionSuccess,
      null,
    );
  };

  unlikeTrack = async () => {
    await unlikeHelper(
      'track',
      rootStore?.playerStore?.currentSong?.id,
      this.onReactionSuccess,
      null,
    );
  };

  reaction = () => {
    const like =
      indexOf(
        [...rootStore?.likedTracks],
        Number(rootStore?.playerStore?.currentSong?.id),
      ) >= 0;
    !like ? this.likeTrack() : this.unlikeTrack();
  };

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    const like =
      indexOf(
        [...rootStore?.likedTracks],
        Number(rootStore?.playerStore?.currentSong?.id),
      ) >= 0;
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
            <TouchableWithoutFeedback onPress={() => navigate('player')}>
              <View style={styles.container}>
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
                      {rootStore.playerStore.currentSong?.getSubTitle()}
                    </Text>
                  </View>
                  <TouchableWithoutFeedback
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
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={this.reaction}>
                    <View cls="pa3">
                      <Image
                        source={
                          like ? Images.ic_like_checked : Images.ic_like_uncheck
                        }
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </TouchableWithoutFeedback>
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
