import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wrap } from '../../../../themes';
import { rootStore } from '../../../../data/context/root_context';
import { D_WIDTH } from '../../../../utils';
import Images from '../../../../assets/icons/icons';
import { indexOf } from 'lodash';

const ActionGroup = wrap(
  ({ item, hasSong, playing, reaction, playSong, addSong, viewModel }) => {
    const [following, setFollowing] = useState(false);
    useEffect(() => {
      setFollowing(
        indexOf([...viewModel?.likedPlaylist], Number(item.id)) >= 0,
      );
    }, []);

    const follow = useCallback(() => {
      setFollowing(!following);
      reaction(following);
    });

    return (
      <ImageBackground
        style={{ width: D_WIDTH, height: 50 }}
        cls="aic jcc"
        resizeMode="contain"
        source={Images.pl_wave}>
        <View cls="flx-row">
          {!hasSong && item?.id !== rootStore.userStore?.id ? (
            <>
              <TouchableWithoutFeedback
                onPress={() => {
                  addSong();
                }}>
                <LinearGradient
                  cls="br5 b--#321A54"
                  colors={['#4A3278', '#8B659D', '#DDA5CB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <Text
                    cls="white f7 pl4 pr4 avertaFont"
                    style={{
                      paddingVertical: 8,
                    }}>
                    Thêm bài hát
                  </Text>
                </LinearGradient>
              </TouchableWithoutFeedback>
            </>
          ) : hasSong ||
            item?.id == 0 ||
            item?.id !== rootStore.userStore?.id ? (
            <>
              <View cls="pa3 pr0">
                <TouchableWithoutFeedback
                  onPress={
                    rootStore.userStore?.id == item?.owner_id || item?.id == 0
                      ? addSong
                      : follow
                  }>
                  {rootStore.userStore?.id == item?.owner_id ||
                  item?.id == 0 ? (
                    <Image
                      cls="widthFn-50 heightFn-50"
                      source={Images.ic_btn_plus}
                    />
                  ) : (
                    <Image
                      cls="widthFn-50 heightFn-50"
                      source={
                        !following ? Images.ic_btn_like : Images.ic_btn_like_on
                      }
                    />
                  )}
                </TouchableWithoutFeedback>
              </View>
              <View cls="pa3 pl0 pr0">
                <TouchableWithoutFeedback onPress={() => playSong()}>
                  <Image
                    resizeMode="contain"
                    cls="widthFn-150 heightFn-50"
                    source={playing ? Images.ic_btn_pause : Images.ic_btn_play}
                  />
                </TouchableWithoutFeedback>
              </View>
              <View cls="pa3 pl0">
                <TouchableWithoutFeedback onPress={() => {}}>
                  <Image
                    cls="widthFn-50 heightFn-50"
                    source={Images.ic_btn_download}
                  />
                </TouchableWithoutFeedback>
              </View>
            </>
          ) : (
            <>
              <TouchableWithoutFeedback
                onPress={() => {
                  addSong();
                }}>
                <LinearGradient
                  cls="br5 b--#321A54"
                  colors={['#4A3278', '#8B659D', '#DDA5CB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <Text
                    cls="white f7 pl4 pr4 avertaFont"
                    style={{
                      paddingVertical: 8,
                    }}>
                    Thêm bài hát
                  </Text>
                </LinearGradient>
              </TouchableWithoutFeedback>
            </>
          )}
        </View>
      </ImageBackground>
    );
  },
);

export default ActionGroup;
