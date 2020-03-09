import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
} from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../themes';
import Images from '../../assets/icons/icons';
import QueueChild from './components/queue_child';
import LinearGradient from 'react-native-linear-gradient';
import { rootStore } from '../../data/context/root_context';
import { subLongStr } from '../../utils';
import QueueList from './components/queue_list';

@observer
@wrap
class Queue extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderQueuePlayer = wrap(() => {
    const { statusPlayer, toggleStatus, currentSong } = rootStore.playerStore;
    return (
      <>
        <ImageBackground
          cls="fullWidth heightFn-72 flx-row aic jcsb pl3 pr3"
          source={Images.bg_player}>
          <View cls="flx-row aic">
            <Image
              source={{
                uri: rootStore.playerStore.currentSong?.getThumb(),
              }}
              cls="widthFn-52 heightFn-52 mr2"
            />
            <View>
              <Text cls="white fw7 f7">
                {currentSong !== null
                  ? subLongStr(currentSong?.getName(), 25)
                  : 'Dèfault Title'}
              </Text>
              <Text cls="primaryPurple f9 pt1">
                Idol {currentSong?.getSubTitlte()} bẢnH
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => toggleStatus()}>
            <Image
              cls="widthFn-52 heightFn-52"
              source={
                statusPlayer == 'pause'
                  ? Images.ic_play_large
                  : Images.ic_pause_large
              }
            />
          </TouchableOpacity>
        </ImageBackground>
      </>
    );
  });

  renderBottomBar = wrap(() => {
    return (
      <LinearGradient
        colors={['#120228', '#1c0836', '#291048']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <View cls="jcc pa3">
          <View cls="flx-row jcsb pl1 pr1 pb3">
            <TouchableOpacity>
              <Image source={Images.ic_add_song} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={Images.ic_trash} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  });

  render() {
    return (
      <View cls="jcsb fullView">
        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 56 }}>
            <View cls="pa3 pb2 bb" style={{ borderBottomColor: '#7351a1' }}>
              <View cls="pl1">
                <QueueChild item={rootStore.playerStore?.currentSong} checked />
              </View>
            </View>
            {this.renderQueuePlayer()}
            <QueueList data={rootStore.songs} title="Danh sách chờ" />
            <QueueList
              data={rootStore.songs}
              title="Playlist :"
              subTitle="Break Point"
            />
          </ScrollView>
        </View>
        <View
          cls="heightFn-56 fullWidth"
          style={{ position: 'absolute', bottom: 0 }}>
          {this.renderBottomBar()}
        </View>
      </View>
    );
  }
}

export default Queue;
