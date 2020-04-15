import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  StyleSheet,
  Switch,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import { D_WIDTH, isTextEmpty, subLongStr } from '../../../utils';
import ImagePicker from 'react-native-image-picker';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import LinearGradient from 'react-native-linear-gradient';
import { apiService } from '../../../data/context/api_context';
import { getPlaylistCover } from '../../../data/datasource/api_helper';
import { rootStore } from '../../../data/context/root_context';

const options = () => ({
  title: 'Chọn ảnh',
  cancelButtonTitle: 'Huỷ',
  takePhotoButtonTitle: 'Chụp ảnh',
  chooseFromLibraryButtonTitle: 'Chọn ảnh từ thư viện',
  quality: 0.6,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    cameraRoll: true,
    skipBackup: true,
    path: 'images',
  },
});

const CreatePlaylistModal = observer(
  wrap(props => {
    let viewModel = props.viewModel;
    const [name, setName] = useState(viewModel.current.name);
    const [description, setDescription] = useState(
      viewModel.current.description,
    );
    const [publicState, setPublic] = useState(viewModel.current.public);
    const [img, setImg] = useState('');

    const resolveResponse = response => {
      const { onCancel, onError, onCustomButton, onSuccess } = props;
      if (response.didCancel) {
        onCancel && onCancel();
      } else if (response.error) {
        onError && onError(response.error);
      } else if (response.customButton) {
        onCustomButton && onCustomButton(response.customButton);
      } else {
        onSuccess && onSuccess(response);
        //If success, handle the response
        setImg(response.data);
      }
    };

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

    const _handleImagePickerOpen = e => {
      let { onSuccess, maxImages, onlyPhoto, onlyCamera } = props;
      onlyPhoto = true;
      if (onlyCamera) {
        return ImagePicker.launchCamera(options(), response => {
          if (!isTextEmpty(response.error)) {
            Alert.alert(response.error);
          } else {
            resolveResponse(response);
          }
        });
      }
      if (onlyPhoto) {
        return ImagePicker.launchImageLibrary(options(), response => {
          if (!isTextEmpty(response.error)) {
            Alert.alert(response.error);
          } else {
            resolveResponse(response);
          }
        });
      }
      ImagePicker.showImagePicker(options(), response => {
        if (!isTextEmpty(response.error)) {
          Alert.alert(response.error);
        } else {
          resolveResponse(response);
        }
      });
    };

    const renderPublicSection = wrap(() => {
      return (
        <View cls="pa3 pb2 pt0">
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
          name: name,
          private: !publicState,
          tracks: tracks,
        };

        const createPl = await apiService.commonApiService.createPlaylist(
          playlistData,
        );

        if (createPl.status == 201) {
          const cover = await getPlaylistCover(tracks);
          const playlistFullInfo = { ...createPl.data, ...cover };
          rootStore.updatePlayList(playlistFullInfo);
          rootStore.libraryStore?.updatePlayList(playlistFullInfo);
          rootStore.homeStore?.addPopular(playlistFullInfo);
          Alert.alert('Tạo thành công');
        } else {
          Alert.alert('Vui lòng thử lại');
        }
        if (typeof props.onClosePress == 'function') {
          props.onClosePress();
        } else {
          props._hideModal();
        }
      } else {
        Alert.alert('Vui lòng nhập tên playlist.');
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
            <View cls="pv2 flx-row aic">
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
        <View cls="pa3 pt4 aic">
          <View cls="pb3">
            <TouchableWithoutFeedback onPress={() => _handleImagePickerOpen()}>
              <Image
                style={{ width: 101, height: 101 }}
                source={
                  !isTextEmpty(img)
                    ? { uri: `data:image/gif;base64,${img}` }
                    : Images.ic_camera
                }
              />
            </TouchableWithoutFeedback>
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
        <View>
          <Image
            resizeMode="stretch"
            style={{ height: 28 }}
            source={Images.sNg}
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
      </View>
    );
  }),
);

export default CreatePlaylistModal;
const SearchItem = observer(
  wrap(props => (
    <View cls="jcsb flx-row aic pb2 pt2 pa3 fullWidth">
      <View cls="flx-row">
        <Image cls="squareFn-50" source={{ uri: props.item.getThumb() }} />
        <View cls="jcc pl3">
          <Text cls="white fw7 f6 lightFont">
            {subLongStr(props.item.getName(), 20)}
          </Text>
          <Text cls="primaryPurple lightFont">{props.item.getSubTitle()}</Text>
        </View>
      </View>
      <View>
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
    height: 45,
    alignItems: 'center',
    marginBottom: 5,
    width: '100%',
  },

  fullWidth: {
    width: D_WIDTH,
    paddingLeft: 6,
  },

  inputGroup2: {
    height: 130,
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
