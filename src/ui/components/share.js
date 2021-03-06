import React, { useCallback, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ImageBackground,
  Linking,
  Clipboard,
  TouchableHighlight,
} from 'react-native';
import { wrap } from '../../themes';
import Images from '../../assets/icons/icons';
import { rootStore } from '../../data/context/root_context';
import {
  isTextEmpty,
  isSmallDevice,
  getStatusBarHeight,
  D_WIDTH,
} from '../../utils/index';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';
import { ShareDialog } from 'react-native-fbsdk';
import ZaloShare from 'react-native-zalo-share';
import { scrollDownPosition } from '../../constant/constant';
import TextTicker from 'react-native-text-ticker';

const ShareModal = wrap(({ _hideModal, item }) => {
  let link;
  switch (item?.getType()) {
    case 'song':
      link = `https://www.diijam.vn/tracks/${item?.id}/`;
      break;
    case 'playlist':
      link = `https://www.diijam.vn/playlists/${item?.id}/`;
      break;
    case 'artist':
      link = `https://www.diijam.vn/artists/${item?.id}/`;
      break;
    case 'article':
      link = `https://www.diijam.vn/articles/${item?.id}/`;
      break;
    default:
      link = '';
  }

  const [shareFBContent] = useState({
    contentType: 'link',
    contentUrl: link,
    contentDescription: 'Diijam!',
  });

  const onShareSms = useCallback(() => {
    Linking.openURL(`sms:/open?addresses=null&body=${link}`);
  });

  const onCopyToClipboard = useCallback(async () => {
    await Clipboard.setString(link);
    Toast.showWithGravity('Đã sao chép liên kết', Toast.LONG, Toast.BOTTOM);
  });

  const onShareZalo = useCallback(() => {
    const config = {
      msg: 'message',
      link: link,
      linkTitle: item?.name,
      linkSource: '',
      linkThumb: item?.getThumb(),
      appName: 'Diijam',
    };
    ZaloShare.shareMessage(config)
      .then(Toast.showWithGravity('Đã chia sẻ', Toast.LONG, Toast.BOTTOM))
      .catch(error => {
        console.log('onShareZalo -> error', error);
        Toast.showWithGravity('Chia sẻ thất bại', Toast.LONG, Toast.BOTTOM);
      });
  });

  const onShareOther = useCallback(async () => {
    const title = '';
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            // For sharing url with custom title.
            placeholderItem: { type: 'url', content: link },
            item: {
              default: { type: 'url', content: link },
            },
            subject: {
              default: title,
            },
            linkMetadata: { originalUrl: link, link, title },
          },
        ],
      },
    });
    try {
      const ShareResponse = await Share.open(options);
      console.log(
        'onShareOther -> ShareResponse ',
        JSON.stringify(ShareResponse, null, 2),
      );
    } catch (error) {
      console.log('onShareOther -> error: '.concat(JSON.stringify(error)));
      Toast.showWithGravity('Chia sẻ thất bại', Toast.LONG, Toast.BOTTOM);
    }
  });

  const shareLinkWithShareDialog = useCallback(() => {
    ShareDialog.canShow(shareFBContent)
      .then(function(canShow) {
        if (canShow) {
          return ShareDialog.show(shareFBContent);
        }
      })
      .then(
        function(result) {
          if (result.isCancelled) {
            Toast.showWithGravity('Đã huỷ', Toast.LONG, Toast.BOTTOM);
          } else {
            Toast.showWithGravity(
              'Chia sẻ thành công',
              Toast.LONG,
              Toast.BOTTOM,
            );
          }
        },
        function(error) {
          Toast.showWithGravity(
            'Chia sẻ thất bại: ' + error,
            Toast.LONG,
            Toast.BOTTOM,
          );
        },
      );
  });

  const shareItems = [
    {
      icon: Images.ic_mess,
      title: 'Tin nhắn',
      action: () => {
        onShareSms();
      },
    },
    {
      icon: Images.ic_fb,
      title: 'Facebook',
      action: () => {
        shareLinkWithShareDialog();
      },
    },
    {
      icon: Images.ic_link,
      title: 'Sao chép liên kết',
      action: () => {
        onCopyToClipboard();
      },
    },
    {
      icon: Images.ic_insta,
      title: 'Instagram',
      action: () => {},
    },
    {
      icon: Images.ic_zalo,
      title: 'Zalo',
      action: () => {
        onShareZalo();
      },
    },
    {
      icon: Images.ic_menu,
      title: 'Thêm nữa',
      action: () => {
        onShareOther();
      },
    },
  ];

  const renderShareItem = useCallback(
    wrap(({ item, index }) => {
      return (
        <View cls={`${index == 0 ? 'pt4' : isSmallDevice() ? 'pt1' : 'pt2'}`}>
          <TouchableHighlight
            activeOpacity={1}
            onPress={() => item?.action()}
            cls="jcc aic br5 ba ml3 mr3 mt2"
            underlayColor="#7c5994">
            <View
              cls={`${
                isSmallDevice() ? 'pa1' : 'pa2'
              } br5 ba fullWidth aic flx-row`}
              style={{
                borderColor: '#d29dc5',
              }}>
              <View cls="pl2">
                <Image
                  cls="widthFn-18 heightFn-18"
                  style={{ tintColor: '#FFF' }}
                  source={item?.icon}
                />
              </View>
              <Text cls="white lightFont pl3">{item?.title}</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }),
  );

  const renderHeader = useCallback(
    wrap(() => {
      return (
        <ImageBackground
          cls="fullWidth"
          resizeMode="cover"
          blurRadius={15}
          source={
            !isTextEmpty(item?.getThumb())
              ? {
                  uri: item?.getThumb(),
                }
              : Images.bAAlbum
          }>
          <ImageBackground
            cls="fullWidth"
            resizeMode="cover"
            source={Images.bNgEn}>
            <View cls="fullWidth jcc">
              <View
                cls="pv2 flx-row aic"
                style={{ paddingTop: getStatusBarHeight() + 10 }}>
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
                  cls={`${isSmallDevice() ? 'squareFn-160' : 'squareFn-200'}`}
                  source={
                    !isTextEmpty(item?.getThumb())
                      ? {
                          uri: item?.getThumb(),
                        }
                      : Images.bAAlbum
                  }
                />
                <View cls="jcc aic jcc pa3">
                  <TextTicker
                    style={{ fontSize: 15 }}
                    duration={6000}
                    loop
                    bounce
                    repeatSpacer={150}
                    scrollSpeed={100}
                    bounceSpeed={400}
                    marqueeDelay={800}>
                    <Text
                      cls={`${
                        isSmallDevice() ? 'f7' : 'f5'
                      } white fw7 pt2 asc avertaFont`}>
                      {typeof item?.getName == 'function' && item?.getName()
                        ? item?.getName()
                        : item?.getName() && typeof item?.getName == 'function'
                        ? item?.getName()
                        : rootStore.playerStore?.currentSong?.getName()}
                    </Text>
                  </TextTicker>

                  <Text
                    cls={`${
                      isSmallDevice() ? 'f9' : 'f7'
                    } white pt2 avertaFont`}>
                    {typeof item?.getSubTitle == 'function' &&
                    item?.getSubTitle()
                      ? item?.getSubTitle()
                      : item?.getSubTitle() &&
                        typeof item?.getSubTitle == 'function'
                      ? item?.getSubTitle()
                      : rootStore.playerStore?.currentSong?.getSubTitle()}
                  </Text>
                </View>
              </View>
            </View>

            <View cls="fullWidth aife asfe" style={styles.underWave}>
              <Image cls="fullWidth" resizeMode="contain" source={Images.sNg} />
            </View>
          </ImageBackground>
        </ImageBackground>
      );
    }),
  );
  return (
    <View cls="fullView">
      <View cls="fullHeight">
        <View cls="flx-i">
          <FlatList
            ListHeaderComponent={renderHeader}
            data={shareItems}
            renderItem={renderShareItem}
            onScroll={event => {
              if (event.nativeEvent.contentOffset.y < scrollDownPosition) {
                _hideModal();
              }
            }}
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
  fullWidth: { width: D_WIDTH },
  title: {
    color: '#FFF',
    justifyContent: 'center',
    fontSize: 23,
    fontFamily: 'Averta-ExtraBold',
  },
});
