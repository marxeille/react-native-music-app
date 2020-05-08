import React, { useCallback } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  ImageBackground,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../../themes';
import { isTextEmpty, isSmallDevice } from '../../../utils';
import Images from '../../../assets/icons/icons';
import ListItem from './list_item';
import SelectImageBtn from '../select_image_btn';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { rootStore } from '../../../data/context/root_context';

const PlaylistMenuConcept = observer(
  wrap(
    ({
      item,
      title,
      newTitleChange,
      textTitleChange,
      editTitle,
      likeCount,
      settingItems,
      changeTitle,
      showEditTitle,
    }) => {
      const onError = useCallback(response => {
        console.log('response picker', response);
      });
      const renderItem = useCallback(item => {
        if (item.item.hidden) {
          return null;
        }
        if (item.item.picker) {
          return (
            <SelectImageBtn
              onSuccess={res => item.item.action(res)}
              onError={onError}
              onlyPhoto>
              <ListItem item={item.item} />
            </SelectImageBtn>
          );
        }
        return <ListItem item={item.item} />;
      });
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View cls="jcc pb3">
            <View cls="pt5 pl5 flx-row aic">
              <Image
                cls={`${isSmallDevice() ? 'squareFn-150' : 'squareFn-180'} asc`}
                source={
                  !isTextEmpty(item?.getThumb()) &&
                  item?.getThumb() != undefined
                    ? { uri: item.getThumb() }
                    : Images.bAAlbum
                }
              />
              <ImageBackground
                cls={`${
                  isSmallDevice()
                    ? 'widthFn-155 heightFn-155'
                    : 'widthFn-185 heightFn-185'
                }  aic jcc`}
                style={{
                  zIndex: -1,
                  position: 'absolute',
                  right: 40,
                  bottom: -5,
                }}
                source={Images.e_cover}>
                <Image
                  cls="circleFn-90 asc"
                  source={
                    !isTextEmpty(item?.getThumb()) &&
                    item?.getThumb() != undefined
                      ? { uri: item.getThumb() }
                      : Images.bAAlbum
                  }
                />
              </ImageBackground>
            </View>
            <View cls="aic jcc pt3 pb3">
              {editTitle ? (
                <View cls="fullWidth pl3 pr3 mb3 mt3">
                  <View
                    cls="jcc ba br2 pa2 bg-#2C184A"
                    style={{ borderColor: '#9166cc' }}>
                    <View cls="aic jcc">
                      <TextInput
                        autoFocus={true}
                        selectTextOnFocus
                        onChangeText={value => textTitleChange(value)}
                        cls={`${
                          isSmallDevice() ? 'f6' : 'f4'
                        } avertaFont white`}
                        defaultValue={title}
                      />
                    </View>

                    <View cls="absolute asfe pr2">
                      <TouchableOpacity
                        onPress={() => {
                          showEditTitle(false);
                          changeTitle(
                            newTitleChange != undefined &&
                              !isTextEmpty(newTitleChange)
                              ? newTitleChange
                              : title,
                          );
                          console.log(
                            'Title:' + title + ', New:' + newTitleChange,
                          );
                        }}>
                        <Image
                          cls={`${
                            isSmallDevice()
                              ? 'widthFn-20 heightFn-20'
                              : 'widthFn-30 heightFn-30'
                          }`}
                          source={Images.ic_checked_song}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <Text cls="avertaFont white f4">
                  {item.getType() == 'artist' ? item.getName() : title}
                </Text>
              )}
              <Text cls="lightFont primaryPurple pt1 f8">
                {item.getType() == 'artist'
                  ? item.getSubTitle()
                  : item.owner_id == rootStore.userStore?.id
                  ? rootStore.userStore?.name
                  : likeCount + ' lượt thích'}
              </Text>
              <View cls={`fullWidth ${isSmallDevice() ? 'heightFn-190' : ''}`}>
                <FlatList
                  data={settingItems}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    },
  ),
);

export default PlaylistMenuConcept;
