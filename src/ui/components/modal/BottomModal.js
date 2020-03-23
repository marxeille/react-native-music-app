import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import Modal from './WrapperModal';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../../main/library/components/LinearGradientText';

@wrap
export default class BottomModal extends React.Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
    };
  }

  shouldComponentUpdate(nextState) {
    if (this.state.isModalVisible !== nextState.isModalVisible) {
      return true;
    }
    return false;
  }

  _showModal = () => this.setState({ isModalVisible: true });

  _hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  _onBackdropPress = () => {
    const { onBackdropPress } = this.props;

    this._hideModal();
    onBackdropPress && onBackdropPress();
  };

  _onHideModal = () => {
    const { onModalHide } = this.props;

    onModalHide && onModalHide();
  };

  _onModalShow = () => {
    const { onModalShow } = this.props;

    onModalShow && onModalShow();
  };

  render() {
    const {
      title,
      children,
      style,
      containerStyle,
      leftIcon = 'close',
      forceInsetBottom = 'always',
      rightComponent,
      avoidKeyboard = false,
      justifyCenterModal = false,
      headerNone = false,
    } = this.props;

    return (
      <Modal
        supportedOrientations={['portrait']}
        cls={`flx-i ma0 ${justifyCenterModal ? '' : 'jcfe'}`}
        isVisible={this.state.isModalVisible}
        onBackButtonPress={this._hideModal}
        onBackdropPress={this._onBackdropPress}
        useNativeDriver
        avoidKeyboard={avoidKeyboard}
        hideModalContentWhileAnimating
        onModalShow={this._onModalShow}
        onModalHide={this._onHideModal}
        // deviceHeight={
        //   Platform.OS === 'ios'
        //     ? null
        //     : ExtraDimensions.get('REAL_WINDOW_HEIGHT')
        // }
        deviceWidth={Dimensions.get('window').height}>
        <SafeAreaView
          forceInset={{ top: 'always', bottom: forceInsetBottom }}
          cls="jcfe">
          {/* <View cls="bg-white fullView" style={[style]}> */}
          <ImageBackground cls="fullView" style={[style]} source={Images.bg}>
            {headerNone ? null : (
              <View cls="pv2 flx-row aic">
                <View cls="aifs jcc flx-i">
                  <TouchableOpacity
                    onPress={this._hideModal}
                    cls="jcc pv1 ph3 aic">
                    <Image
                      cls="widthFn-20 heightFn-20"
                      source={Images.ic_delete}
                    />
                  </TouchableOpacity>
                </View>
                <View cls="aic jcc flexFn-5 pt2">
                  <LinearGradientText
                    text={`${title}`}
                    end={{ x: 0.7, y: 0 }}
                    styles={{
                      justifyContent: 'center',
                      fontSize: 23,
                      fontFamily: 'Averta-ExtraBold',
                    }}
                  />
                </View>
                <View cls="flx-i" />
                {rightComponent ? (
                  <View cls="absolute right-0">{rightComponent}</View>
                ) : null}
              </View>
            )}

            <View style={[containerStyle]}>{children}</View>

            {headerNone ? (
              <View cls="aic jcc pt4">
                <TouchableOpacity
                  onPress={this._hideModal}
                  cls="jcc pv1 ph3 aic">
                  <View
                    cls="br5 ba pa1 pl4 pr4"
                    style={{ borderColor: '#d29dc5' }}>
                    <Text cls="white fw6 f9">Đóng</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </ImageBackground>
          {/* </View> */}
        </SafeAreaView>
      </Modal>
    );
  }
}
