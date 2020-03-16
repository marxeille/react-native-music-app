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
      repeatOn: false,
      shuffleOn: false,
    };
  }

  componentDidMount() {
    if (rootStore.playerStore?.selectedId == null) {
      const track = this.props.tracks[this.state.selectedTrack];
      rootStore.playerStore?.setSelectedId(track.id);
      this.playingTrack(track.id);
    } else {
      this.setState({
        selectedTrack: _.findIndex(this.props.tracks, [
          'id',
          rootStore.playerStore?.selectedId,
        ]),
      });
    }
  }

  playingTrack = id => {
    rootStore?.playerStore?.playSong(id);
  };

  seek(time) {
    time = Math.round(time);
    this.context.playerRef.seek(time);
  }

  onBack() {
    if (this.state.selectedTrack > 0) {
      const prevTrack = this.props.tracks[this.state.selectedTrack - 1];
      rootStore.playerStore?.setSelectedId(prevTrack.id);
      this.playingTrack(prevTrack.id);
      rootStore?.playerStore?.setPosition(0);
      this.setState({ isChanging: true });
      setTimeout(
        () =>
          this.setState({
            isChanging: false,
            selectedTrack: this.state.selectedTrack - 1,
          }),
        0,
      );
    } else {
      this.context.playerRef?.seek(0);
    }
  }

  onForward() {
    if (this.state.selectedTrack < this.props.tracks.length - 1) {
      const nextTrack = this.props.tracks[this.state.selectedTrack + 1];
      rootStore.playerStore?.setSelectedId(nextTrack.id);
      this.playingTrack(nextTrack.id);
      rootStore?.playerStore?.setPosition(0);
      this.setState({ isChanging: true });
      setTimeout(
        () =>
          this.setState({
            isChanging: false,
            selectedTrack: this.state.selectedTrack + 1,
          }),
        0,
      );
    }
  }

  onEnd = () => {
    this.onForward.bind(this);
  };

  render() {
    const track = this.props.tracks[this.state.selectedTrack];
    const { currentSong } = rootStore?.playerStore;
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Header message="Playing From Charts" />
        <AlbumArt url={currentSong?.artwork ?? track.artwork} />
        <TrackDetails
          title={currentSong?.title ?? track.title}
          artist={currentSong?.artist ?? track.artist}
        />
        <SeekBar
          onSeek={this.seek.bind(this)}
          trackLength={rootStore?.playerStore?.duration}
          onSlidingStart={() => this.setState({ paused: true })}
          currentPosition={rootStore?.playerStore?.position}
        />
        <Controls
          onPressRepeat={() =>
            this.setState({ repeatOn: !this.state.repeatOn })
          }
          repeatOn={this.state.repeatOn}
          shuffleOn={this.state.shuffleOn}
          forwardDisabled={
            this.state.selectedTrack === this.props.tracks.length - 1
          }
          onPressShuffle={() =>
            this.setState({ shuffleOn: !this.state.shuffleOn })
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
