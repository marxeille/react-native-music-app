import React, { useCallback } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  ImageBackground,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../../themes';
import { isTextEmpty, isSmallDevice, isMeidumDevice } from '../../../utils';
import Images from '../../../assets/icons/icons';
import ListItem from './list_item';
import SelectImageBtn from '../select_image_btn';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { rootStore } from '../../../data/context/root_context';
import { scrollDownPosition } from '../../../constant/constant';
import TextTicker from 'react-native-text-ticker';

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
      hideModal,
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
      const newTitle = '';
      const renderHeader = useCallback(
        wrap(() => {
          return (
            <View>
              <View cls="pt5 pl5 flx-row aic">
                <Image
                  cls={`${
                    isSmallDevice() ? 'squareFn-150' : 'squareFn-180'
                  } asc`}
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
                    right: isSmallDevice() ? 45 : isMeidumDevice() ? 75 : 60,
                    bottom: -5,
                  }}
                  source={Images.e_cover}>
                  <Image
                    cls="circleFn-90 asc"
                    style={{ transform: [{ rotate: '30deg' }] }}
                    source={
                      !isTextEmpty(item?.getThumb()) &&
                      item?.getThumb() != undefined
                        ? { uri: item.getThumb() }
                        : Images.bAAlbum
                    }
                  />
                </ImageBackground>
              </View>
              <View cls="aic jcc pa3">
                {editTitle ? (
                  <View cls="fullWidth pa3">
                    <View
                      cls="jcc ba br2 pa2 bg-#2C184A"
                      style={{ borderColor: '#9166cc' }}>
                      <View cls="aic jcc">
                        <TextInput
                          autoFocus={true}
                          selectTextOnFocus
                          onChangeText={value => (this.newTitle = value)}
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
                              this.newTitle != undefined &&
                                !isTextEmpty(this.newTitle)
                                ? this.newTitle
                                : title,
                            );
                          }}>
                          <Image
                            cls={`${
                              isSmallDevice() ? 'squareFn-20' : 'squareFn-30'
                            }`}
                            source={Images.ic_checked_song}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : (
                  <TextTicker
                    style={{ fontSize: 15 }}
                    duration={12000}
                    loop
                    bounce
                    repeatSpacer={150}
                    scrollSpeed={100}
                    bounceSpeed={400}
                    marqueeDelay={800}>
                    <Text cls="avertaFont white f4">
                      {item?.getType() == 'artist'
                        ? item?.getName()
                        : item?.getName()}
                    </Text>
                  </TextTicker>
                )}
                <Text cls="lightFont primaryPurple pt1 f8">
                  {item?.getType() == 'artist'
                    ? item?.getSubTitle()
                    : item.owner_id == rootStore.userStore?.id
                    ? rootStore.userStore?.name
                    : item?.getType() == 'article'
                    ? item?.getSubTitle()
                    : likeCount + ' lượt thích'}
                </Text>
              </View>
            </View>
          );
        }),
      );
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View
            cls={`jcc pb3 ${
              isSmallDevice()
                ? 'heightFn-500'
                : isMeidumDevice()
                ? 'heightFn-520'
                : ''
            }`}>
            <View cls="fullWidth">
              <FlatList
                ListHeaderComponent={renderHeader}
                data={settingItems}
                onScroll={event => {
                  if (event.nativeEvent.contentOffset.y < scrollDownPosition) {
                    if (typeof hideModal == 'function') hideModal();
                  }
                }}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    },
  ),
);

export default PlaylistMenuConcept;
