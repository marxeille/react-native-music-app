import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { observer } from 'mobx-react';
import { rootStore } from '../../../data/context/root_context';
import { wrap } from '../../../themes';
import { isSmallDevice, subLongStr } from '../../../utils';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import BottomModal from '../../components/modal/BottomModal';

@observer
@wrap
export default class PlayerInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.modalShare = React.createRef();
  }

  _showModal = () => {
    if (this.modalShare && this.modalShare.current) {
      this.modalShare.current._showModal();
    }
  };

  _hideModal = () => {
    if (this.modalShare && this.modalShare.current) {
      this.modalShare.current._hideModal();
    }
  };

  _renderModalContent = wrap(() => {
    return (
      <View cls="jcc pt3">
        <ImageBackground
          cls="fullWidth jcc"
          resizeMode="cover"
          style={{ opacity: 0.8 }}
          source={{
            uri: rootStore.playerStore?.currentSong?.getThumb(),
          }}>
          <View cls="flx-row pa3">
            <Image
              cls="widthFn-150 heightFn-150"
              source={{ uri: rootStore.playerStore?.currentSong?.getThumb() }}
            />
            <View cls="pl3  jcc">
              <Text cls="white fw7 f6 lightFont">
                {subLongStr(rootStore.playerStore?.currentSong?.getName(), 18)}
              </Text>
              <Text cls="white pt1 lightFont">
                {rootStore.playerStore?.currentSong?.getSubTitle()}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <View cls="pa3 pt4 jcc">
          <TouchableOpacity>
            <View cls="flx-row aic pt3 lightFont">
              <Image source={Images.ic_mess} />
              <Text cls="fw7 f6 primaryPurple pl3">Tin nhắn</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View cls="flx-row aic pt5 lightFont">
              <Image source={Images.ic_fb} />
              <Text cls="fw7 f6 primaryPurple pl3">Facebook</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View cls="flx-row aic pt5 lightFont">
              <Image source={Images.ic_link} />
              <Text cls="fw7 f6 primaryPurple pl3">Sao chép liên kết</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View cls="flx-row aic pt5 lightFont">
              <Image source={Images.ic_menu} />
              <Text cls="fw7 f6 primaryPurple pl3">Thêm nữa</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  });

  render() {
    return (
      <View>
        <View cls={`flx-row jcsa aic pt${isSmallDevice() ? 3 : 4}`}>
          <TouchableOpacity onPress={() => {}}>
            <Image source={Images.ic_like} />
          </TouchableOpacity>
          <TouchableOpacity>
            <LinearGradientText
              text={rootStore.playerStore?.currentSong?.getName()}
              end={{ x: 0.7, y: 0 }}
              styles={{
                justifyContent: 'center',
                fontSize: 23,
                fontWeight: '800',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this._showModal}>
            <Image source={Images.ic_share} />
          </TouchableOpacity>
        </View>
        <Text cls="white pt2 asc f7">
          Idol {rootStore.playerStore?.currentSong?.getSubTitle()} bẢnH
        </Text>
        <BottomModal
          ref={this.modalShare}
          title={'Chia sẻ'}
          // onModalShow={this._showModal}
          justifyCenterModal
          // onModalHide={this._hideModal}
          containerCls="">
          {this._renderModalContent()}
        </BottomModal>
      </View>
    );
  }
}
