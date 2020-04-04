import React, { useCallback, useEffect, useRef } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  ImageBackground,
} from 'react-native';
import { wrap } from '../../themes';
import { RootContext, rootStore } from '../../data/context/root_context';
import { observer } from 'mobx-react';
import Images from '../../assets/icons/icons';
import TrackPlayer, { usePlaybackState } from 'react-native-track-player';
import Player from './components/player';
import playlistData from './data/playlist.json';
import { pop } from '../../navigation/navigation_service';
import { getStatusBarHeight, isSmallDevice } from '../../utils';
import { skipToNext, skipToPrevious } from './service/play_service';
import BottomModal from '../components/modal/BottomModal';
import SongMenu from './components/song_menu';
const react_native_1 = require('react-native');
const TrackPlayerState = react_native_1.NativeModules.TrackPlayerModule;

const PlayerFull = observer(
  wrap(props => {
    const playbackState = usePlaybackState();

    const modalMenu = useRef();

    const _showModal = useCallback(() => {
      if (modalMenu && modalMenu.current) {
        modalMenu.current._showModal();
      }
    });

    const _hideModal = useCallback(() => {
      if (modalMenu && modalMenu.current) {
        modalMenu.current._hideModal();
      }
    });

    useEffect(() => {
      TrackPlayer.getCurrentTrack().then(value => {
        if (value == undefined) {
          TrackPlayer.setupPlayer();
          TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
              TrackPlayerState.CAPABILITY_PLAY,
              TrackPlayerState.CAPABILITY_PAUSE,
              TrackPlayerState.CAPABILITY_SKIP_TO_NEXT,
              TrackPlayerState.CAPABILITY_SKIP_TO_PREVIOUS,
              TrackPlayerState.CAPABILITY_STOP,
            ],
            compactCapabilities: [
              TrackPlayerState.CAPABILITY_PLAY,
              TrackPlayerState.CAPABILITY_PAUSE,
            ],
          });
        }
      });
    }, []);

    useEffect(() => {
      togglePlayback(false);
    }, []);

    async function togglePlayback(togglePlayback = true) {
      const currentTrack = await TrackPlayer.getCurrentTrack();

      if (currentTrack == null) {
        await TrackPlayer.reset();
        rootStore.updateSongs(playlistData);
        rootStore.queueStore.addSongs(playlistData);
        await TrackPlayer.add(playlistData);
        // await TrackPlayer.add({
        //   id: 'local-track',
        //   url: localTrack,
        //   title: 'Pure (Demo)',
        //   artist: 'David Chavez',
        //   artwork: 'https://picsum.photos/200',
        // });
        await TrackPlayer.play();
      } else {
        if (togglePlayback) {
          if (playbackState === TrackPlayerState.STATE_PAUSED) {
            await TrackPlayer.play();
          } else {
            await TrackPlayer.pause();
          }
        }
      }
    }

    async function onSeek(value) {
      await TrackPlayer.seekTo(value);
    }

    const renderHeader = useCallback(
      wrap(() => {
        return (
          <>
            <View cls="flx-row jcsa aic">
              <TouchableOpacity onPress={() => pop()}>
                <Image source={Images.ic_down} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pop()}>
                <Text cls="white fw8 f5"> Today's Top Hits </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={_showModal}>
                <Image source={Images.ic_menu} />
              </TouchableOpacity>
            </View>
          </>
        );
      }),
    );

    return (
      <View cls="fullView">
        {/* <ImageBackground source={Images.bg} cls="fullView"> */}
        <View cls="pa2">
          {renderHeader()}
          <View cls={`aic pt${isSmallDevice() ? 3 : 4} fullWidth`}>
            <Image
              cls="widthFn-327 heightFn-327"
              source={require('../../assets/images/khabanh.png')}
            />
          </View>
          <Player
            onNext={skipToNext}
            onSeek={onSeek}
            onPrevious={skipToPrevious}
            onTogglePlayback={togglePlayback}
          />
          <Text cls="white asc">Now {getStateName(playbackState)}</Text>
        </View>
        <BottomModal ref={modalMenu} headerNone>
          <SongMenu _hideModal={this._hideModal} />
        </BottomModal>
        {/* </ImageBackground> */}
      </View>
    );
  }),
);

export default PlayerFull;

function getStateName(state) {
  switch (state) {
    case TrackPlayerState.STATE_NONE:
      return 'None';
    case TrackPlayerState.STATE_PLAYING:
      return 'Playing';
    case TrackPlayerState.STATE_PAUSED:
      return 'Paused';
    case TrackPlayerState.STATE_STOPPED:
      return 'Stopped';
    case TrackPlayerState.STATE_BUFFERING:
      return 'Buffering';
  }
}
