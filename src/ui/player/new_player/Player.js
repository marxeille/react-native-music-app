import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
  TouchableOpacity,
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
import { wrap } from '../../../themes';
import { isMeidumDevice, isSmallDevice } from '../../../utils';
import { ShareDialog } from 'react-native-fbsdk';
import SongMenu from '../components/song_menu';

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

  shareLinkWithShareDialog() {
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
  }

  _renderModalContent = wrap(() => {
    const { showPlayMenu } = this.state;

    return showPlayMenu ? (
      <SongMenu song={rootStore.playerStore?.currentSong} />
    ) : (
      <View cls="jcc pt3">
        <ImageBackground
          cls="fullWidth jcc"
          resizeMode="cover"
          blurRadius={15}
          source={{
            uri: rootStore.playerStore?.currentSong?.getThumb(),
          }}>
          <View cls="flx-row pa3">
            <Image
              cls="widthFn-150 heightFn-150"
              source={{ uri: rootStore.playerStore?.currentSong?.getThumb() }}
            />
            <View cls="pl3  jcc">
              <Text cls="white fw7 f6">
                {rootStore.playerStore?.currentSong?.getName()}
              </Text>
              <Text cls="white pt1">
                {rootStore.playerStore?.currentSong?.getSubTitle()}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <View cls="pa3 pt4 jcc">
          <TouchableOpacity>
            <View cls="flx-row aic pt3">
              <Image source={Images.ic_mess} />
              <Text cls="fw7 f6 primaryPurple pl3">Tin nhắn</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.shareLinkWithShareDialog.bind(this)}>
            <View cls="flx-row aic pt5">
              <Image source={Images.ic_fb} />
              <Text cls="fw7 f6 primaryPurple pl3">Facebook</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View cls="flx-row aic pt5">
              <Image source={Images.ic_link} />
              <Text cls="fw7 f6 primaryPurple pl3">Sao chép liên kết</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View cls="flx-row aic pt5">
              <Image source={Images.ic_menu} />
              <Text cls="fw7 f6 primaryPurple pl3">Thêm nữa</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  });

  render() {
    const { currentSong } = rootStore?.playerStore;
    const { showPlayMenu } = this.state;

    return (
      <ImageBackground source={Images.bg3} style={styles.container}>
        <StatusBar hidden={true} />
        <Header _showModal={this._showModal} message="Playing From Charts" />
        <AlbumArt url={currentSong?.artwork} />
        <TrackDetails
          title={currentSong?.title}
          artist={currentSong?.artist}
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
            rootStore?.playerStore?.setShuffle(!rootStore?.playerStore?.shuffle)
          }
          onPressPlay={() => rootStore?.playerStore?.setState('playing')}
          onPressPause={() => rootStore?.playerStore?.setState('pause')}
          onBack={this.onBack.bind(this)}
          onForward={this.onForward.bind(this)}
          paused={rootStore?.playerStore?.statusPlayer == 'pause'}
        />
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
          headerNone={showPlayMenu}
          // onModalHide={this._hideModal}
          containerCls="">
          {this._renderModalContent()}
        </BottomModal>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
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
