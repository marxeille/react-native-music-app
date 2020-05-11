import React, { useCallback } from 'react';
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
} from 'react-native';
import { wrap } from '../../themes';
import Images from '../../assets/icons/icons';
import { rootStore } from '../../data/context/root_context';
import { isTextEmpty, isSmallDevice } from '../../utils/index';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';
import { ShareDialog } from 'react-native-fbsdk';
import ZaloShare from 'react-native-zalo-share';

const ShareModal = wrap(({ _hideModal, item }) => {
  let link;
  switch (item?.getType()) {
    case 'song':
      // code block
      link = `diijam.vn/tracks/${item?.id}`;
      break;
    case 'playlist':
      // code block
      link = `diijam.vn/playlists/${item?.id}`;
      break;
    case 'artist':
      // code block
      link = `diijam.vn/artists/${item?.id}`;
      break;
    case 'article':
      // code block
      link = `diijam.vn/articles/${item?.id}`;
      break;
    default:
      // code block
      link = '';
  }
  const shareLinkContent = {
    contentType: 'link',
    contentUrl: link,
    contentDescription: 'Diijam!!!',
  };

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
    ShareDialog.canShow(shareLinkContent)
      .then(function(canShow) {
        if (canShow) {
          return ShareDialog.show(shareLinkContent);
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
    wrap(({ item }) => {
      return (
        <View cls={`${isSmallDevice() ? 'pt1' : 'pt2'}`}>
          <TouchableOpacity
            onPress={() => item?.action()}
            cls="jcc pv1 ph3 aic">
            <View
              cls={`${
                isSmallDevice() ? 'pa1' : 'pa2'
              } br5 ba fullWidth aic flx-row`}
              style={{ borderColor: '#d29dc5' }}>
              <View cls="pl2">
                <Image
                  cls="widthFn-18 heightFn-18"
                  style={{ tintColor: '#FFF' }}
                  source={item?.icon}
                />
              </View>
              <Text cls="white lightFont pl3">{item?.title}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }),
  );
  console.log('item', item);

  return (
    <View cls="fullView">
      <View cls="fullHeight">
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
                  !isTextEmpty(item?.getThumb())
                    ? {
                        uri: item?.getThumb(),
                      }
                    : Images.bAAlbum
                }
              />
              <View cls="jcc aic">
                <Text
                  cls={`${
                    isSmallDevice() ? 'f7' : 'f5'
                  } white fw7 pt2 avertaFont`}>
                  {item?.getName() ??
                    rootStore.playerStore?.currentSong?.getName()}
                </Text>
                <Text
                  cls={`${isSmallDevice() ? 'f9' : 'f7'} white pt1 avertaFont`}>
                  {item?.getSubTitle() ??
                    rootStore.playerStore?.currentSong?.getSubTitle()}
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
