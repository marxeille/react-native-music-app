import React, { useCallback, useMemo } from 'react';
import { View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import { isTextEmpty } from '../../utils';

const SelectImageBtn = ({
  children,
  onSuccess,
  onError,
  onlyPhoto,
  onlyCamera,
  onCancel,
  onCustomButton,
}) => {
  const options = useCallback(() => ({
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
  }));
  const resolveResponse = useCallback(response => {
    if (response.didCancel) {
      onCancel && onCancel();
    } else if (response.error) {
      onError && onError(response.error);
    } else if (response.customButton) {
      onCustomButton && onCustomButton(response.customButton);
    } else {
      onSuccess && onSuccess(response);
    }
  });

  const _handleImagePickerOpen = useCallback(e => {
    if (onlyCamera) {
      return ImagePicker.launchCamera(options(), response => {
        if (!isTextEmpty(response.error)) {
          Toast.showWithGravity(response.error, Toast.LONG, Toast.BOTTOM);
        } else {
          resolveResponse(response);
        }
      });
    }
    if (onlyPhoto) {
      return ImagePicker.launchImageLibrary(options(), response => {
        if (!isTextEmpty(response.error)) {
          Toast.showWithGravity(response.error, Toast.LONG, Toast.BOTTOM);
        } else {
          resolveResponse(response);
        }
      });
    }
    ImagePicker.showImagePicker(options(), response => {
      if (!isTextEmpty(response.error)) {
        Toast.showWithGravity(response.error, Toast.LONG, Toast.BOTTOM);
      } else {
        resolveResponse(response);
      }
    });
  });

  return (
    <View>
      <TouchableOpacity onPress={_handleImagePickerOpen}>
        {children}
      </TouchableOpacity>
    </View>
  );
};

export default SelectImageBtn;
