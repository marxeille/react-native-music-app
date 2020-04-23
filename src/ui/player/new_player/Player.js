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

  onSwipeDown = () => {
    pop();
  };

  _renderModalContent = wrap(() => {
    const { showPlayMenu } = this.state;

    return showPlayMenu ? (
      <SongMenu
        song={rootStore.playerStore?.currentSong}
        _hideModal={this._hideModal}
      />
    ) : (
      <ScrollView
        style={{ width: '100%', height: '100%' }}
        showsVerticalScrollIndicator={false}>
        <View cls="fullHeight jcc pt3">
          <ImageBackground
            cls="fullWidth jcsb"
            resizeMode="cover"
            blurRadius={15}
            source={
              !isTextEmpty(rootStore.playerStore?.currentSong?.artwork)
                ? {
                    uri: rootStore.playerStore?.currentSong?.artwork,
                  }
                : Images.bAAlbum
            }>
            <View cls="fullWidth jcc">
              <View cls="flx-row aic pt3 jcsb">
                <View cls="aifs jcc">
                  <TouchableOpacity onPress={this._hideModal} cls="jcc aic">
                    <Image
                      cls="widthFn-20 heightFn-20 ml3"
                      style={{ tintColor: '#FFF' }}
                      source={Images.ic_delete}
                    />
                  </TouchableOpacity>
                </View>
                <View cls="aic jcc mr3">
                  <Text
                    style={{
                      color: '#FFF',
                      justifyContent: 'center',
                      fontSize: 23,
                      fontFamily: 'Averta-ExtraBold',
                    }}>
                    Chia sẻ
                  </Text>
                </View>
                <View />
              </View>
              <View cls="aic pt4 pb4">
                <Image
                  cls="widthFn-200 heightFn-200"
                  source={
                    !isTextEmpty(rootStore.playerStore?.currentSong?.artwork)
                      ? { uri: rootStore.playerStore?.currentSong?.artwork }
                      : Images.bAAlbum
                  }
                />
                <View cls="jcc aic">
                  <Text cls="white fw7 f5 mt2 avertaFont">
                    {subLongStr(
                      rootStore.playerStore?.currentSong?.getName(),
                      18,
                    )}
                  </Text>
                  <Text
                    cls="white f7 pt1"
                    style={{ fontFamily: 'lato-regular' }}>
                    {rootStore.playerStore?.currentSong?.getSubTitle()}
                  </Text>
                </View>
              </View>
            </View>

            <View
              cls="fullWidth aife asfe"
              style={{ position: 'absolute', bottom: -24, height: 50 }}>
              <Image cls="fullWidth" resizeMode="contain" source={Images.sNg} />
            </View>
          </ImageBackground>

          <View cls="fullWidth mt4 jcc">
            <TouchableOpacity cls="jcc pv1 ph3 aic">
              <View
                cls="br5 ba pa2 fullWidth aic flx-row"
                style={{ borderColor: '#d29dc5' }}>
                <View cls="pl2">
                  <Image
                    cls="widthFn-18 heightFn-18"
                    style={{ tintColor: '#FFF' }}
                    source={Images.ic_mess}
                  />
                </View>
                <Text cls="white lightFont pl3">Tin nhắn</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.shareLinkWithShareDialog.bind(this)}
              cls="jcc pv1 ph3 aic mt3">
              <View
                cls="br5 ba pa2 fullWidth aic flx-row"
                style={{ borderColor: '#d29dc5' }}>
                <View cls="pl2">
                  <Image
                    cls="widthFn-18 heightFn-18"
                    style={{ tintColor: '#FFF' }}
                    source={Images.ic_fb}
                  />
                </View>
                <Text cls="white lightFont pl3">Facebook</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity cls="jcc pv1 ph3 aic mt3">
              <View
                cls="br5 ba pa2 fullWidth aic flx-row"
                style={{ borderColor: '#d29dc5' }}>
                <View cls="pl2">
                  <Image
                    cls="widthFn-18 heightFn-18"
                    style={{ tintColor: '#FFF' }}
                    source={Images.ic_link}
                  />
                </View>
                <Text cls="white lightFont pl3">Sao chép liên kết</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity cls="jcc pv1 ph3 aic mt3">
              <View
                cls="br5 ba pa2 fullWidth aic flx-row"
                style={{ borderColor: '#d29dc5' }}>
                <View cls="pl2">
                  <Image
                    cls="widthFn-18 heightFn-18"
                    style={{ tintColor: '#FFF' }}
                    source={Images.ic_insta}
                  />
                </View>
                <Text cls="white lightFont pl3">Instagram</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity cls="jcc pv1 ph3 aic mt3">
              <View
                cls="br5 ba pa2 fullWidth aic flx-row"
                style={{ borderColor: '#d29dc5' }}>
                <View cls="pl2">
                  <Image
                    cls="widthFn-18 heightFn-18"
                    style={{ tintColor: '#FFF' }}
                    source={Images.ic_zalo}
                  />
                </View>
                <Text cls="white lightFont pl3">Zalo</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity cls="jcc pv1 ph3 aic mt3">
              <View
                cls="br5 ba pa2 fullWidth aic flx-row"
                style={{ borderColor: '#d29dc5' }}>
                <View cls="pl2">
                  <Image
                    cls="widthFn-18 heightFn-18"
                    style={{ tintColor: '#FFF' }}
                    source={Images.ic_menu}
                  />
                </View>
                <Text cls="white lightFont pl3">Thêm nữa</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  });

  render() {
    const { currentSong } = rootStore?.playerStore;
    const { showPlayMenu } = this.state;
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    return (
      <ImageBackground source={Images.bg3} style={styles.container}>
        <StatusBar hidden={true} />
        <Header _showModal={this._showModal} message="Playing From Charts" />
        <GestureRecognizer onSwipeDown={this.onSwipeDown} config={config}>
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
          forceInsetTop={'never'}
          forceInsetBottom={'never'}
          headerNone={true}
          closeBottomNone={true}
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
