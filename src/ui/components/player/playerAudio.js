import React from 'react';
import Video from 'react-native-video';
import { observer } from 'mobx-react';
import { rootStore } from '../../../data/context/root_context';
import { PlayerContext } from '../../../data/context/player_context';
import Toast from 'react-native-simple-toast';
@observer
class PlayerAudio extends React.Component {
  static contextType = PlayerContext;
  constructor(props) {
    super(props);
    this.state = {
      playerRef: null,
      currentPosition: 0,
    };
  }

  setTime(data) {
    if (Math.floor(data.seekableDuration) == rootStore?.playerStore?.duration) {
      rootStore?.playerStore?.setPosition(Math.floor(data.currentTime));
    }
  }

  setDuration(data) {
    rootStore?.playerStore?.setDuration(Math.floor(data.duration));
  }

  onEnd = () => {
    if (rootStore?.playerStore?.repeatOne) {
      return;
    } else {
      if (
        rootStore?.playerStore?.repeat ||
        rootStore.playerStore?.trackIndex <
          rootStore.playerStore?.getQueueSize() - 1
      ) {
        rootStore.playerStore?.changeSong('next');
      }
    }
  };

  videoError = () => {
    Toast.showWithGravity(
      'Có lỗi xảy ra khi load bài hát, vui lòng thử lại sau.',
      Toast.LONG,
      Toast.BOTTOM,
    );
  };

  render() {
    const { currentSong } = rootStore?.playerStore;

    return rootStore?.playerStore?.currentSong ? (
      <Video
        source={{ uri: currentSong.url }} // Can be a URL or a local file.
        ref={ref => {
          this.playerRef = ref;
          !this.state.playerRef && this.setState({ playerRef: ref });
          this.context.setPlayerRef(this.state.playerRef);
        }}
        paused={rootStore?.playerStore?.statusPlayer == 'pause'} // Pauses playback entirely.
        resizeMode="cover" // Fill the whole screen at aspect ratio.
        repeat={rootStore?.playerStore?.repeatOne} // Repeat forever.
        //   onLoadStart={this.loadStart} // Callback when video starts to load
        onLoad={this.setDuration.bind(this)} // Callback when video loads
        onProgress={this.setTime.bind(this)} // Callback every ~250ms with currentTime
        onEnd={this.onEnd} // Callback when playback finishes
        onError={this.videoError} // Callback when video cannot be loaded
        //   style={styles.audioElement}
        ignoreSilentSwitch={'ignore'}
        playWhenInactive={true}
        playInBackground={true}
      />
    ) : null;
  }
}

export default PlayerAudio;
