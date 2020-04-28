import React, { useCallback } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { wrap } from '../../themes';
import Images from '../../assets/icons/icons';
import { rootStore } from '../../data/context/root_context';
import { isTextEmpty, isSmallDevice } from '../../utils/index';

const ShareModal = wrap(({ shareItems, _hideModal }) => {
  const renderShareItem = useCallback(
    wrap(({ item }) => {
      return (
        <View cls={`${isSmallDevice() ? 'pt1' : 'pt2'}`}>
          <TouchableOpacity onPress={() => item.action()} cls="jcc pv1 ph3 aic">
            <View
              cls={`${
                isSmallDevice() ? 'pa1' : 'pa2'
              } br5 ba fullWidth aic flx-row`}
              style={{ borderColor: '#d29dc5' }}>
              <View cls="pl2">
                <Image
                  cls="widthFn-18 heightFn-18"
                  style={{ tintColor: '#FFF' }}
                  source={item.icon}
                />
              </View>
              <Text cls="white lightFont pl3">{item.title}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }),
  );
  return (
    <View cls="fullView">
      <View cls="fullHeight">
        <ImageBackground
          cls="fullWidth"
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
            <View cls="pv2 flx-row aic">
              <View cls="aifs jcc flx-i">
                <TouchableOpacity onPress={_hideModal} cls="jcc aic">
                  <Image
                    cls="widthFn-20 heightFn-20 ml3"
                    style={{ tintColor: '#FFF' }}
                    source={Images.ic_delete}
                  />
                </TouchableOpacity>
              </View>
              <View cls="aic jcc flexFn-5">
                <Text style={styles.title}>Chia sẻ</Text>
              </View>
              <View cls="flx-i" />
            </View>
            <View cls="aic pt3 pb3">
              <Image
                cls={`${
                  isSmallDevice()
                    ? 'widthFn-160 heightFn-160'
                    : 'widthFn-200 heightFn-200'
                }`}
                source={
                  !isTextEmpty(rootStore.playerStore?.currentSong?.artwork)
                    ? { uri: rootStore.playerStore?.currentSong?.artwork }
                    : Images.bAAlbum
                }
              />
              <View cls="jcc aic">
                <Text
                  cls={`${
                    isSmallDevice() ? 'f7' : 'f5'
                  } white fw7 pt2 avertaFont`}>
                  {rootStore.playerStore?.currentSong?.getName()}
                </Text>
                <Text
                  cls={`${isSmallDevice() ? 'f9' : 'f7'} white pt1 avertaFont`}>
                  {rootStore.playerStore?.currentSong?.getSubTitle()}
                </Text>
              </View>
            </View>
          </View>

          <View cls="fullWidth aife asfe" style={styles.underWave}>
            <Image cls="fullWidth" resizeMode="contain" source={Images.sNg} />
          </View>
        </ImageBackground>

        <View cls="fullWidth pt3">
          <FlatList
            data={shareItems}
            renderItem={renderShareItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </View>
  );
});

export default ShareModal;
const styles = StyleSheet.create({
  underWave: { position: 'absolute', bottom: 8, height: 20 },
  title: {
    color: '#FFF',
    justifyContent: 'center',
    fontSize: 23,
    fontFamily: 'Averta-ExtraBold',
  },
});
