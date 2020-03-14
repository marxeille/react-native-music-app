import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  Switch,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import SongOfAlBumStore from '../../../data/repository/song_of_album_store';
import { observer } from 'mobx-react';
import { apiService } from '../../../data/context/api_context';
import { makeCancelable, getStatusBarHeight } from '../../../utils';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import { rootStore } from '../../../data/context/root_context';
import LinearGradient from 'react-native-linear-gradient';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import AlbumItem from './components/album_item';
import SongMenu from '../../player/components/song_menu';
import BottomModal from '../../components/modal/BottomModal';

@observer
@wrap
export default class AlbumDetail extends Component {
  constructor(props) {
    super(props);
    this.model = SongOfAlBumStore.create({
      id: props.route?.params?.id ?? '',
      state: 'loading',
      songs: [],
    });
    this.modalSong = React.createRef();
    this.state = {
      download: false,
    };
  }

  componentDidMount() {
    this.cancelablePromise = makeCancelable(
      apiService.commonApiService.getSongsOfAlBum(1).then((values: Array) => {
        rootStore.updateSongs(values);
        this.model.addList(values.map(data => data?.id));
      }),
    );

    this.model.getSongs();
  }

  componentWillUnmount() {
    this.cancelablePromise.cancel();
  }

  _showModal = () => {
    if (this.modalSong && this.modalSong.current) {
      this.modalSong.current._showModal();
    }
  };

  _hideModal = () => {
    if (this.modalSong && this.modalSong.current) {
      this.modalSong.current._hideModal();
    }
  };

  renderHeaderSection = wrap(() => {
    return (
      <>
        <ImageBackground
          cls={`jcsb pa3 heightFn-300`}
          // style={{ height: '60%' }}
          source={require('../../../assets/images/khabanh2.png')}>
          <View
            cls="flx-row aic jcsb"
            style={{ paddingTop: getStatusBarHeight() }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
                cls="widthFn-10 heightFn-20"
                source={Images.ic_back_white}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={Images.ic_menu_white} />
            </TouchableOpacity>
          </View>
          <View cls="aic jcc">
            <Text cls="white fw8 f3 pb2">
              {"Today's top hits".toUpperCase()}
            </Text>
            <Text cls="white f8">
              {'Idol khÁ bẢnH is on top of the Vinahey hey hey!'}
            </Text>
            <Text cls="f9 primaryPurple">{'7.000.000.000 Người theo dõi'}</Text>
          </View>
        </ImageBackground>
      </>
    );
  });

  renderMiddleSection = wrap(() => {
    return (
      <>
        <View>
          <View cls="pt2 aic">
            <TouchableOpacity>
              <View
                cls="widthFn-140 aic ba br5 pa4 pt1 pb1"
                style={{ borderColor: '#d7a0c8' }}>
                <Text cls="white f9 fw6">{`theo dõi`.toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <ImageBackground
              cls="heightFn-100 aic pt4"
              style={{ width: '100%' }}
              source={Images.wave}>
              <TouchableOpacity onPress={this.handleLogin}>
                <LinearGradient
                  cls="ba br5 b--#321A54"
                  colors={['#4A3278', '#8B659D', '#DDA5CB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <Text cls="white f6 fw7 pa2 pl4 pr4">Phát trộn bài</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </View>
      </>
    );
  });

  renderDownloadSection = wrap(() => {
    return (
      <>
        <View cls="pa3 pb2 pt0 fullWidth">
          <View cls="flx-row jcsb aic">
            <LinearGradientText
              text={'Tải xuống'}
              end={{ x: 0.6, y: 0 }}
              styles={{
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: '800',
              }}
            />
            <Switch
              value={this.state.download}
              style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
              onValueChange={value => {
                this.setState({ download: value });
              }}
            />
          </View>
        </View>
      </>
    );
  });

  _renderListHeaderContent = wrap(() => {
    return (
      <>
        {this.renderHeaderSection()}
        {this.renderMiddleSection()}
        {this.renderDownloadSection()}
      </>
    );
  });

  _renderItem = wrap(item => {
    return (
      <View cls="pa3 pt0">
        <AlbumItem openModal={this._showModal} />
      </View>
    );
  });

  render() {
    return (
      <ImageBackground cls="fullView" source={Images.bg}>
        <FlatList
          ListHeaderComponent={this._renderListHeaderContent()}
          data={[1, 2, 3, 4, 5]}
          showsVerticalScrollIndicator={false}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <BottomModal ref={this.modalSong} headerNone>
          <SongMenu
            song={{
              title: 'hey hey hey',
              artist: 'idol giới trẻ khÁ bẢnH',
              artwork: '',
            }}
          />
        </BottomModal>
      </ImageBackground>
    );
  }
}
