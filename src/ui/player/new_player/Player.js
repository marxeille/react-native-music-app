import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
  TouchableOpacity,
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
import { isMeidumDevice } from '../../../utils';
import images from '../../../styles/images';

@observer
@wrap
export default class Player extends Component {
  static contextType = PlayerContext;
  constructor(props) {
    super(props);
    this.state = {
      selectedTrack: 0,
    };
    this.modalShare = React.createRef();
  }

  componentDidMount() {
    const trackId = this.props.route?.params?.trackId;

    rootStore.playerStore?.prepareSong(trackId ?? null);
    // if (rootStore.playerStore?.selectedId == null) {
    //   const track = this.props.tracks[this.state.selectedTrack];
    //   rootStore.playerStore?.setSelectedId(track.id);
    //   this.playingTrack(track.id);
    // } else {
    //   this.setState({
    //     selectedTrack: _.findIndex(this.props.tracks, [
    //       'id',
    //       rootStore.playerStore?.selectedId,
    //     ]),
    //   });
    // }
  }

  // playingTrack = id => {
  //   rootStore?.playerStore?.playSong(id);
  // };

  _showModal = () => {
    if (this.modalShare && this.modalShare.current) {
      this.modalShare.current._showModal();
    }
  };

  _hideModal = () => {
    if (this.modalShare && this.modalShare.current) {
      this.modalShare.current._hideModal();
    }
  };

  _renderModalContent = wrap(() => {
    return (
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
                {rootStore.playerStore?.currentSong?.getSubTitlte()}
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
          <TouchableOpacity>
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

  seek(time) {
    time = Math.round(time);
    this.context.playerRef.seek(time);
  }

  onBack() {
    if (rootStore.playerStore?.trackIndex > 0) {
      rootStore.playerStore?.changeSong('back');
      // const prevTrack = this.props.tracks[this.state.selectedTrack - 1];
      // rootStore.playerStore?.setSelectedId(prevTrack.id);
      // this.playingTrack(prevTrack.id);
      // rootStore?.playerStore?.setPosition(0);
      // setTimeout(
      //   () =>
      //     this.setState({
      //       selectedTrack: this.state.selectedTrack - 1,
      //     }),
      //   0,
      // );
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
      //   const nextTrack = this.props.tracks[this.state.selectedTrack + 1];
      //   rootStore.playerStore?.setSelectedId(nextTrack.id);
      //   this.playingTrack(nextTrack.id);
      //   rootStore?.playerStore?.setPosition(0);
      //   setTimeout(
      //     () =>
      //       this.setState({
      //         selectedTrack: this.state.selectedTrack + 1,
      //       }),
      //     0,
      //   );
      // }
    }
  }

  render() {
    const { currentSong } = rootStore?.playerStore;

    return (
      <ImageBackground source={Images.bg3} style={styles.container}>
        <StatusBar hidden={true} />
        <Header message="Playing From Charts" />
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
          currentPosition={rootStore?.playerStore?.position}
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
        {isMeidumDevice() ? null : (
          <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
            <Image
              source={require('../../../assets/images/wave2.png')}
              style={{ zIndex: 0, width: '100%', height: 130 }}
            />
          </View>
        )}

        <BottomModal
          ref={this.modalShare}
          title={'Chia sẻ'}
          // onModalShow={this._showModal}
          justifyCenterModal
          // onModalHide={this._hideModal}
          containerCls="">
          {this._renderModalContent()}
        </BottomModal>
      </ImageBackground>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  audioElement: {
    height: 0,
    width: 0,
  },
};
