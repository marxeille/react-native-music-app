import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  StyleSheet,
  Switch,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import {
  D_WIDTH,
  isTextEmpty,
  subLongStr,
  isSmallDevice,
  getStatusBarHeight,
} from '../../../utils';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import SelectImageBtn from '../select_image_btn';
import { ScrollView } from 'react-native-gesture-handler';

const CreatePlaylistModal = observer(
  wrap(props => {
    let viewModel = props.viewModel;
    const [name, setName] = useState(viewModel.current.name);
    const [description, setDescription] = useState(
      viewModel.current.description,
    );
    const [publicState, setPublic] = useState(viewModel.current.public);
    const [img, setImg] = useState('');
    const [path, setPathToImg] = useState('');

    const onSuccess = useCallback(response => {
      setImg(response.data);
      setPathToImg(response.uri);
    });

    const onError = useCallback(response => {
      Toast.showWithGravity(response, Toast.LONG, Toast.BOTTOM);
    });

    const removeSong = useCallback(song => {
      viewModel.current.removeSong(song);
    });

    const setPlName = useCallback(name => {
      setName(name);
      viewModel.current.setPlaylistName(name);
    });

    const setPlDescription = useCallback(des => {
      setDescription(des);
      viewModel.current.setPlaylistDescription(des);
    });

    const renderPublicSection = wrap(() => {
      return (
        <View cls={`${isSmallDevice() ? 'pl3 pr3' : 'pa3 pb2'} pt0`}>
          <View cls="flx-row jcsb aic">
            <Text cls="white lightFont">Công khai</Text>
            <Switch
              value={publicState}
              trackColor={{ true: '#d59fc6', false: 'grey' }}
              style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
              onValueChange={value => {
                setPublic(value);
                viewModel.current.setPublicState(value);
              }}
            />
          </View>
        </View>
      );
    });

    const renderItem = useCallback(
      wrap(item => {
        return (
          <View cls="fullWidth">
            <SearchItem item={item.item} removeSong={removeSong} />
          </View>
        );
      }),
    );

    const createPlaylist = useCallback(async () => {
      if (!isTextEmpty(name)) {
        const tracks = [...viewModel.current.songs.values()].map((song, i) => {
          return { position: i, track_id: song.id };
        });

        const playlistData = {
          cover: path,
          name: name,
          private: !publicState,
          tracks: tracks,
        };

        viewModel.current.createPlaylist(playlistData);

        if (typeof props.onClosePress == 'function') {
          props.onClosePress();
        } else {
          props._hideModal();
        }
      } else {
        Toast.showWithGravity(
          'Vui lòng nhập tên playlist',
          Toast.LONG,
          Toast.BOTTOM,
        );
      }
    });

    const renderRightAction = useCallback(() => {
      return (
        <View cls="jcc pv1 ph3 aic">
          <TouchableOpacity onPress={createPlaylist}>
            <Image source={Images.ic_v} />
          </TouchableOpacity>
        </View>
      );
    });

    const renderHeader = useCallback(
      wrap(() => {
        return (
          <LinearGradient
            colors={['#291047', '#1a0632', '#110926', '#110926']}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}>
            <View
              cls="pv2 flx-row aic"
              style={{ paddingTop: getStatusBarHeight() + 10 }}>
              <View cls="aifs jcc flx-i">
                <TouchableOpacity
                  onPress={() => {
                    typeof props.onClosePress == 'function'
                      ? props.onClosePress()
                      : props._hideModal();
                  }}
                  cls="jcc pv1 ph3 aic">
                  <Image source={Images.ic_delete} />
                </TouchableOpacity>
              </View>
              <View cls="aic jcc flexFn-5 pt2">
                <LinearGradientText
                  text={`Tạo Playlist`}
                  end={{ x: 0.7, y: 0 }}
                  styles={{
                    justifyContent: 'center',
                    fontSize: 21,
                    fontWeight: '800',
                  }}
                />
              </View>
              {renderRightAction()}
            </View>
          </LinearGradient>
        );
      }),
    );

    return (
      <View cls="fullView">
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View cls="pa3 pt4 aic">
              <View cls="pb3">
                <SelectImageBtn
                  onSuccess={onSuccess}
                  onError={onError}
                  onlyPhoto>
                  <Image
                    style={{
                      width: isSmallDevice() ? 90 : 101,
                      height: isSmallDevice() ? 90 : 101,
                    }}
                    source={
                      !isTextEmpty(img)
                        ? { uri: `data:image/gif;base64,${img}` }
                        : Images.ic_camera
                    }
                  />
                </SelectImageBtn>
              </View>
              <View cls="pb3">
                <View cls="pa3 bg-#100024" style={[styles.inputGroup]}>
                  <TextInput
                    secureTextEntry={false}
                    placeholderTextColor="#9166cc"
                    placeholder={'Tên Playlist'}
                    style={[styles.inputText]}
                    value={name}
                    textAlign={'center'}
                    onChangeText={txt => setPlName(txt)}
                    autoCorrect={false}
                  />
                </View>
              </View>
              <View
                cls="pa3 bg-#100024"
                style={[styles.inputGroup, styles.inputGroup2]}>
                <TextInput
                  secureTextEntry={false}
                  placeholderTextColor="#9166cc"
                  placeholder={'Viết mô tả'}
                  style={[styles.inputText]}
                  textAlignVertical={'top'}
                  numberOfLines={5}
                  value={description}
                  onChangeText={txt => setPlDescription(txt)}
                  autoCorrect={false}
                  multiline={true}
                />
              </View>
              <View cls="pt3" style={styles.fullWidth}>
                {renderPublicSection()}
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View>
            <Image
              resizeMode="contain"
              style={{ height: isSmallDevice() ? 30 : 50, width: D_WIDTH }}
              source={Images.pl_wave}
            />
          </View>
          <View cls="pa3">
            <TouchableWithoutFeedback onPress={() => props.toggleAddSong(true)}>
              <View cls="flx-row aic">
                <Image source={Images.ic_plus} />
                <Text cls="white lightFont pl2">Thêm bài hát</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <FlatList
            data={[...viewModel.current.songs.values()]}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      </View>
    );
  }),
);

export default CreatePlaylistModal;
const SearchItem = observer(
  wrap(props => (
    <View cls="jcsb flx-row aic pb2 pt2 pa3 fullWidth">
      <Image
        cls="squareFn-50"
        source={
          typeof props.item?.getThumb == 'function' &&
          props.item?.getThumb() !== ''
            ? { uri: props.item?.getThumb() }
            : Images.bAAlbum
        }
      />
      <View cls="flx-i flx-wrap">
        <View cls="jcc pl3 pr3">
          <Text
            cls={`${isSmallDevice() ? 'f8' : 'f6'} white fw7 lightFont`}
            numberOfLines={1}
            ellipsizeMode="tail">
            {props.item.getName()}
          </Text>
          <Text
            cls={`${isSmallDevice() ? 'f9' : ''} primaryPurple lightFont`}
            numberOfLines={1}
            ellipsizeMode="tail">
            {props.item && typeof props.item?.getName == 'function'
              ? props.item?.getName()
              : ''}
          </Text>
        </View>
      </View>
      <View cls="flx-row">
        <TouchableOpacity onPress={() => props.removeSong(props.item)}>
          <Image source={Images.ic_del_song} />
        </TouchableOpacity>
      </View>
    </View>
  )),
);
const styles = StyleSheet.create({
  inputGroup: {
    borderWidth: 1,
    borderColor: '#100024',
    borderRadius: 7,
    flexDirection: 'row',
    height: isSmallDevice() ? 40 : 55,
    alignItems: 'center',
    marginBottom: 5,
    width: '100%',
  },

  fullWidth: {
    width: D_WIDTH,
    paddingLeft: 6,
  },

  inputGroup2: {
    height: isSmallDevice() ? 100 : 130,
    alignItems: 'flex-start',
  },
  inputText: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    fontFamily: 'lato-regular',
    color: '#9166cc',
  },
});
