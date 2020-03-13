import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import Modal from './WrapperModal';
import { wrap } from '../../../themes';

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
          <View cls="bg-white br3" style={[style]}>
            <View cls="pv2 flx-row aic">
              <View cls="aifs jcc flx-i">
                <TouchableOpacity
                  onPress={this._hideModal}
                  cls="jcc pv1 ph3 aic">
                  {/* left icon here */}
                </TouchableOpacity>
              </View>
              <View cls="aic jcc flexFn-5">
                <Text numberOfLines={1} cls="strongTextTitle mediumFont f6 mv1">
                  {`${title}`}
                </Text>
              </View>
              <View cls="flx-i" />
              {rightComponent ? (
                <View cls="absolute right-0">{rightComponent}</View>
              ) : null}
            </View>
            <View style={[containerStyle]}>{children}</View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}
