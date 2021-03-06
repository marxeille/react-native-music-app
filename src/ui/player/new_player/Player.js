import React, { Component } from 'react';
import {
  View,
  StatusBar,
  ImageBackground,
  Image,
  StyleSheet,
} from 'react-native';
import Header from './Header';
import AlbumArt from './AlbumArt';
import TrackDetails from './TrackDetails';
import SeekBar from './SeekBar';
import Controls from './Controls';
import { observer } from 'mobx-react';
import { rootStore } from '../../../data/context/root_context';
import { PlayerContext } from '../../../data/context/player_context';
import Images from '../../../assets/icons/icons';
import BottomModal from '../../components/modal/BottomModal';
import * as _ from 'lodash';
import { wrap } from '../../../themes';
import { isMeidumDevice, isSmallDevice } from '../../../utils';
import SongMenu from '../components/song_menu';
import GestureRecognizer from 'react-native-swipe-gestures';
import { pop } from '../../../navigation/navigation_service';
import ShareModal from '../../components/share';

@observer
@wrap
export default class Player extends Component {
  static contextType = PlayerContext;
  constructor(props) {
    super(props);
    this.state = {
      selectedTrack: 0,
      showPlayMenu: false,
    };
    this.modalShare = React.createRef();
  }

  componentDidMount() {
    const trackId = this.props.route?.params?.trackId;
    rootStore.playerStore?.prepareSong(trackId ?? null);
  }

  _showModal = (playMenu = false) => {
    this.setState({ showPlayMenu: playMenu }, () => {
      if (this.modalShare && this.modalShare.current) {
        this.modalShare.current._showModal();
      }
    });
  };

  _hideModal = () => {
    if (this.modalShare && this.modalShare.current) {
      this.modalShare.current._hideModal();
    }
  };

  seek(time) {
    time = Math.round(time);
    this.context.playerRef.seek(time);
    rootStore?.playerStore?.setPosition(time);
    rootStore?.playerStore?.setState('play');
  }

  onBack() {
    if (rootStore.playerStore?.trackIndex > 0) {
      if (rootStore.playerStore?.position > 3) {
        this.context.playerRef?.seek(0);
        rootStore.playerStore?.setPosition(0);
      } else {
        rootStore.playerStore?.changeSong('back', this.context.playerRef?.seek);
      }
    } else {
      this.context.playerRef?.seek(0);
    }
  }

  onForward() {
    if (
      rootStore.playerStore?.trackIndex < rootStore.playerStore?.getQueueSize()
    ) {
      rootStore.playerStore?.changeSong('next', this.context.playerRef?.seek);
    }
  }

  onSwipeDown = () => {
    pop();
  };

  _renderModalContent = wrap(() => {
    const { showPlayMenu } = this.state;
    if (showPlayMenu) {
      return (
        <SongMenu
          song={rootStore.playerStore?.currentSong}
          toggleShareMenu={() => this.setState({ showPlayMenu: false })}
          _hideModal={this._hideModal}
        />
      );
    } else {
      return (
        <ShareModal
          item={rootStore.playerStore?.currentSong}
          _hideModal={this._hideModal}
        />
      );
    }
  });

  onSwipeLeft = () => {
    this.props._handleIndexChange(1);
  };

  render() {
    const { currentSong } = rootStore?.playerStore;
    const { showPlayMenu } = this.state;
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };

    return (
      <ImageBackground
        blurRadius={15}
        source={Images.default_wave_bg}
        style={styles.container}>
        <StatusBar hidden={true} />
        <GestureRecognizer
          onSwipeDown={this.onSwipeDown}
          onSwipeLeft={this.onSwipeLeft}
          config={config}>
          <Header
            message={`${rootStore?.playerStore?.playFrom.toUpperCase()}`}
          />
          <AlbumArt url={currentSong?.artwork} />
          <TrackDetails
            title={currentSong?.getName() ?? 'Chưa xác định'}
            artist={currentSong?.getSubTitle(false)}
            onSharePress={this._showModal}
          />
          <SeekBar
            onSeek={this.seek.bind(this)}
            trackLength={rootStore?.playerStore?.duration}
            onSlidingStart={() => rootStore?.playerStore?.setState('pause')}
          />
          <Controls
            onPressRepeat={() => {
              if (!rootStore?.playerStore?.repeat) {
                rootStore?.playerStore?.setRepeat(
                  !rootStore?.playerStore?.repeat,
                );
              } else if (!rootStore?.playerStore?.repeatOne) {
                rootStore?.playerStore?.setRepeatOne(
                  !rootStore?.playerStore?.repeatOne,
                );
              } else {
                rootStore?.playerStore?.setRepeatOne(false);
                rootStore?.playerStore?.setRepeat(false);
              }
            }}
            repeatOn={rootStore?.playerStore?.repeat}
            repeatOneOn={rootStore?.playerStore?.repeatOne}
            shuffleOn={rootStore?.playerStore?.shuffle}
            forwardDisabled={
              rootStore.playerStore?.trackIndex ===
              rootStore.playerStore?.getQueueSize()
            }
            onPressShuffle={() =>
              rootStore?.playerStore?.setShuffle(
                !rootStore?.playerStore?.shuffle,
              )
            }
            onPressPlay={() => rootStore?.playerStore?.setState('playing')}
            onPressPause={() => rootStore?.playerStore?.setState('pause')}
            onBack={this.onBack.bind(this)}
            onForward={this.onForward.bind(this)}
            paused={rootStore?.playerStore?.statusPlayer == 'pause'}
          />
        </GestureRecognizer>

        {isSmallDevice() ? (
          <></>
        ) : (
          <View style={styles.beatContainer}>
            <Image
              source={Images.wave2}
              resizeMode="stretch"
              style={styles.beat}
            />
          </View>
        )}

        <BottomModal
          ref={this.modalShare}
          title={'Chia sẻ'}
          // onModalShow={this._showModal}
          // onModalHide={this._hideModal}
          justifyCenterModal
          forceInsetTop={'never'}
          forceInsetBottom={'never'}
          headerNone={true}
          closeBottomNone={!showPlayMenu}
          customGradient={['#1a0632', '#1a0632', '#000', '#13151A']}
          containerCls="">
          {this._renderModalContent()}
        </BottomModal>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
    tintColor: '#FFF',
  },
  container: {
    flex: 1,
  },
  beat: {
    zIndex: 0,
    width: '100%',
    height: '100%',
  },
  beatContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: isSmallDevice() ? 50 : isMeidumDevice() ? 70 : 100,
  },
});
