import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import Header from './Header';
import AlbumArt from './AlbumArt';
import TrackDetails from './TrackDetails';
import SeekBar from './SeekBar';
import Controls from './Controls';
import { observer } from 'mobx-react';
import { rootStore } from '../../../data/context/root_context';
import { PlayerContext } from '../../../data/context/player_context';
import * as _ from 'lodash';

@observer
export default class Player extends Component {
  static contextType = PlayerContext;
  constructor(props) {
    super(props);

    this.state = {
      selectedTrack: 0,
    };
  }

  componentDidMount() {
    const trackId = this.props.route?.params?.trackId;
    console.log('trackId', trackId);

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
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Header message="Playing From Charts" />
        <AlbumArt url={currentSong?.artwork} />
        <TrackDetails title={currentSong?.title} artist={currentSong?.artist} />
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
      </View>
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
