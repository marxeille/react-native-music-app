import React, { useCallback, useEffect } from 'react';
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
const react_native_1 = require('react-native');
const TrackPlayerState = react_native_1.NativeModules.TrackPlayerModule;

const PlayerFull = observer(
  wrap(props => {
    const playbackState = usePlaybackState();

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
            <View cls="aic jcc flx-row">
              <Image cls="mr2" source={Images.ic_down} />
              <Image source={Images.ic_menu} />
            </View>
            <View cls="flx-row jcsa aic">
              <TouchableOpacity onPress={() => pop()}>
                <Image source={Images.ic_down} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pop()}>
                <Text cls="white fw8 f5"> Today's Top Hits </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={Images.ic_menu} />
              </TouchableOpacity>
            </View>
          </>
        );
      }),
    );

    return (
      <ImageBackground source={Images.bg} cls="fullView">
        <View cls="pa2" style={{ marginTop: getStatusBarHeight() }}>
          {renderHeader()}
          <View cls={`aic pt${isSmallDevice() ? 4 : 5} fullWidth`}>
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
      </ImageBackground>
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
