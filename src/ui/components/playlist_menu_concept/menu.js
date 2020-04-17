import React, { useCallback } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  ImageBackground,
} from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../../themes';
import { isTextEmpty, isSmallDevice } from '../../../utils';
import Images from '../../../assets/icons/icons';
import ListItem from './list_item';

const PlaylistMenuConcept = observer(
  wrap(({ item, setMenu }) => {
    const settingItems = [
      {
        title: 'Đổi ảnh bìa',
        action: () => {},
        icon: Images.ic_pic,
        imgStyle: 'widthFn-20 heightFn-18',
      },
      {
        title: 'Đổi tên',
        action: () => {},
        icon: Images.ic_pen,
      },
      {
        title: 'Sửa playlist',
        action: () => {
          setMenu(false);
        },
        icon: Images.ic_list,
      },
      {
        title: 'Public playlist',
        action: () => {},
        icon: Images.ic_lock,
        imgStyle: 'widthFn-17 heightFn-20',
      },
      {
        title: 'Xoá playlist',
        action: () => {},
        icon: Images.ic_circle_minus,
      },
    ];

    const renderItem = useCallback(item => {
      return <ListItem item={item.item} />;
    });
    return (
      <View cls="jcc pb3">
        <View cls="pt5 pl5 flx-row aic">
          <Image
            cls="squareFn-180 asc"
            source={
              !isTextEmpty(item.getThumb())
                ? { uri: item.getThumb() }
                : Images.bAAlbum
            }
          />
          <ImageBackground
            cls="widthFn-185 heightFn-185 aic jcc"
            style={{ zIndex: -1, position: 'absolute', right: 40, bottom: -5 }}
            source={Images.e_cover}>
            <Image
              cls="circleFn-90 asc"
              source={
                !isTextEmpty(item.getThumb())
                  ? { uri: item.getThumb() }
                  : Images.bAAlbum
              }
            />
          </ImageBackground>
        </View>
        <View cls="aic jcc pt3 pb3">
          <Text cls="avertaFont white f4">{item.title()}</Text>
          <Text cls="lightFont primaryPurple pt1 f8">{item.subTitle()}</Text>
          <View cls={`fullWidth ${isSmallDevice() ? 'heightFn-250' : ''}`}>
            <FlatList
              data={settingItems}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </View>
    );
  }),
);

export default PlaylistMenuConcept;
const styles = StyleSheet.create({});
