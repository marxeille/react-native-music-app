import React, { Component } from 'react';
import {
  View,
  StatusBar,
  ImageBackground,
  Image,
  StyleSheet,
  Alert,
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
import { ScrollView } from 'react-native-gesture-handler';
import { wrap } from '../../../themes';
import {
  isMeidumDevice,
  isSmallDevice,
  subLongStr,
  isTextEmpty,
} from '../../../utils';
import { ShareDialog } from 'react-native-fbsdk';
import SongMenu from '../components/song_menu';
import GestureRecognizer, {
  swipeDirections,
} from 'react-native-swipe-gestures';
import { pop } from '../../../navigation/navigation_service';
import ShareModal from '../../components/share';

@observer
@wrap
export default class Player extends Component {
  static contextType = PlayerContext;
  constructor(props) {
    super(props);
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: 'https://facebook.com',
      contentDescription: 'Facebook sharing is easy!',
    };
    this.state = {
      selectedTrack: 0,
      shareLinkContent: shareLinkContent,
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
  }

  onBack() {
    if (rootStore.playerStore?.trackIndex > 0) {
      rootStore.playerStore?.changeSong('back');
    } else {
      this.context.playerRef?.seek(0);
    }
  }

  onForward() {
    if (
      rootStore.playerStore?.trackIndex <
      rootStore.playerStore?.getQueueSize() - 1
    ) {
      rootStore.playerStore?.changeSong('next');
    }
  }

  shareLinkWithShareDialog = () => {
    var tmp = this;
    ShareDialog.canShow(this.state.shareLinkContent)
      .then(function(canShow) {
        if (canShow) {
          return ShareDialog.show(tmp.state.shareLinkContent);
        }
      })
      .then(
        function(result) {
          if (result.isCancelled) {
            Alert.alert('Đã huỷ');
          } else {
            Alert.alert('Chia sẻ thành công với id: ' + result.postId);
          }
        },
        function(error) {
          Alert.alert('Chia sẻ thất bại: ' + error);
        },
      );
  };

  onSwipeDown = () => {
    pop();
  };

  _renderModalContent = wrap(() => {
    const { showPlayMenu } = this.state;

    const shareItems = [
      {
        icon: Images.ic_mess,
        title: 'Tin nhắn',
        action: () => {},
      },
      {
        icon: Images.ic_fb,
        title: 'Facebook',
        action: () => {
          this.shareLinkWithShareDialog();
        },
      },
      {
        icon: Images.ic_link,
        title: 'Sao chép liên kết',
        action: () => {},
      },
      {
        icon: Images.ic_insta,
        title: 'Instagram',
        action: () => {},
      },
      {
        icon: Images.ic_zalo,
        title: 'Zalo',
        action: () => {},
      },
      {
        icon: Images.ic_menu,
        title: 'Thêm nữa',
        action: () => {},
      },
    ];

    return showPlayMenu ? (
      <SongMenu
        song={rootStore.playerStore?.currentSong}
        _hideModal={this._hideModal}
      />
    ) : (
      <ShareModal
        song={rootStore.playerStore?.currentSong}
        _hideModal={this._hideModal}
        shareItems={shareItems}
      />
    );
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
        source={Images.bg2}
        style={styles.container}>
        <StatusBar hidden={true} />
        <GestureRecognizer
          onSwipeDown={this.onSwipeDown}
          onSwipeLeft={this.onSwipeLeft}
          config={config}>
          <Header message="Playing From Charts" />
          <AlbumArt url={currentSong?.artwork} />
          <TrackDetails
            title={currentSong?.getName()}
            artist={currentSong?.getSubTitle()}
            onSharePress={this._showModal}
          />
          <SeekBar
            onSeek={this.seek.bind(this)}
            trackLength={rootStore?.playerStore?.duration}
            onSlidingStart={() => this.setState({ paused: true })}
          />
          <Controls
            onPressRepeat={() =>
              rootStore?.playerStore?.setRepeat(!rootStore?.playerStore?.repeat)
            }
            repeatOn={rootStore?.playerStore?.repeat}
            shuffleOn={rootStore?.playerStore?.shuffle}
            forwardDisabled={
              rootStore.playerStore?.trackIndex ===
              rootStore.playerStore?.getQueueSize() - 1
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
        <View style={styles.beatContainer}>
          <Image
            source={Images.wave2}
            resizeMode="stretch"
            style={styles.beat}
          />
        </View>
        <BottomModal
          ref={this.modalShare}
          title={'Chia sẻ'}
          // onModalShow={this._showModal}
          justifyCenterModal
          // forceInsetTop={'never'}
          forceInsetBottom={'never'}
          headerNone={true}
          closeBottomNone={!showPlayMenu}
          // onModalHide={this._hideModal}
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
    height: isSmallDevice() ? 50 : isMeidumDevice() ? 70 : 130,
  },
});
