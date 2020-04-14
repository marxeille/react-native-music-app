import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import { D_WIDTH, isTextEmpty } from '../../../utils';
import ImagePicker from 'react-native-image-picker';

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
    const [description, setDescription] = useState('');
    const [publicState, setPublic] = useState(false);

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
      }
    };

    const _handleImagePickerOpen = e => {
      const { onSuccess, maxImages, onlyPhoto, onlyCamera } = props;
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
              }}
            />
          </View>
        </View>
      );
    });

    return (
      <View cls="fullView">
        <View cls="pa3 pt4 aic">
          <View cls="pb3">
            <TouchableWithoutFeedback onPress={() => _handleImagePickerOpen()}>
              <Image
                style={{ width: 101, height: 101 }}
                source={Images.ic_camera}
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
                value={''}
                textAlign={'center'}
                onChangeText={txt => console.log('txt', txt)}
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
              onChangeText={txt => setDescription(txt)}
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
          <TouchableWithoutFeedback>
            <View cls="flx-row aic">
              <Image source={Images.ic_plus} />
              <Text cls="white lightFont pl2">Thêm bài hát</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }),
);

export default CreatePlaylistModal;
const styles = StyleSheet.create({
  inputGroup: {
    borderWidth: 1,
    borderColor: '#100024',
    borderRadius: 7,
    flexDirection: 'row',
    height: 40,
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
  },
});
