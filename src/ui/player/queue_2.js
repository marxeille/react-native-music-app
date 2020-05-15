import React, { Component } from 'react';
import {
  View,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../themes';
import Images from '../../assets/icons/icons';
import QueueChild from './components/queue_child';
import LinearGradient from 'react-native-linear-gradient';
import { rootStore } from '../../data/context/root_context';
import { subLongStr, D_HEIGHT, isTextEmpty, isSmallDevice } from '../../utils';
import DraggableFlatList from 'react-native-draggable-flatlist';
import LinearGradientText from '../main/library/components/LinearGradientText';
import * as _ from 'lodash';
import GestureRecognizer from 'react-native-swipe-gestures';
import TextTicker from 'react-native-text-ticker';
import { AsyncStorageKey } from '../../constant/constant';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';

@observer
@wrap
class Queue2 extends Component {
  constructor(props) {
    super(props);
    this.config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    // this.flatListRef = React.createRef();
    this.state = {
      checkedSongs: [],
    };
  }

  renderQueuePlayer = wrap(() => {
    const { toggleStatus, currentSong } = rootStore.playerStore;

    return (
      <View cls="pb3">
        <FlatList
          data={[...rootStore.historyStore.songs]}
          renderItem={this.renderItem}
        />
        <ImageBackground
          cls="fullWidth heightFn-72 flx-row aic jcsb pl3 pr3"
          source={Images.bg_mini_player}>
          <View cls="flx-row aic">
            <Image
              source={
                !isTextEmpty(rootStore.playerStore.currentSong?.getThumb())
                  ? {
                      uri: rootStore.playerStore.currentSong?.getThumb(),
                    }
                  : Images.bAAlbum
              }
              cls="widthFn-52 heightFn-52 mr3"
            />
            <View>
              <TextTicker
                style={{ fontSize: 17 }}
                duration={6000}
                loop
                bounce
                repeatSpacer={150}
                scrollSpeed={100}
                bounceSpeed={400}
                marqueeDelay={800}>
                <Text cls="white fw7 f6 latoFont">
                  {currentSong !== null
                    ? subLongStr(
                        currentSong?.getName() ?? '',
                        isSmallDevice() ? 15 : 20,
                      )
                    : 'Dèfault Title'}
                </Text>
              </TextTicker>
              <Text cls="primaryPurple f9 pt1 latoFont">
                {subLongStr(
                  currentSong?.getSubTitle(),
                  isSmallDevice() ? 15 : 20,
                )}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => toggleStatus()}>
            <Image
              cls="widthFn-52 heightFn-52 pl2"
              source={
                rootStore.playerStore.statusPlayer == 'pause'
                  ? Images.ic_btn_play2
                  : Images.ic_btn_pause2
              }
            />
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  });

  removeSongs = async () => {
    const { checkedSongs } = this.state;
    this.setState({ checkedSongs: [] });
    rootStore?.queueStore?.removeSongs(checkedSongs);
    rootStore?.historyStore?.removeSongs(checkedSongs);
    const localHistory = await AsyncStorage.getItem(AsyncStorageKey.HISTORY);
    let localHistoryJson = JSON.parse(localHistory);
    if (localHistoryJson !== null) {
      _.remove(localHistoryJson, song => {
        return (
          _.indexOf(checkedSongs, song.id) >= 0 &&
          song.owner_id == rootStore.userStore?.id
        );
      });
      AsyncStorage.setItem(
        AsyncStorageKey.HISTORY,
        JSON.stringify(localHistoryJson),
      );
    }
  };

  addSongsToQueue = () => {
    this.state.checkedSongs.map(song => {
      if (Number(song) !== Number(rootStore?.playerStore?.currentSong?.id)) {
        rootStore.queueStore.addSong({ id: song });
      }
    });
    this.setState({ checkedSongs: [] });
    Toast.showWithGravity('Thêm thành công', Toast.LONG, Toast.BOTTOM);
  };

  renderBottomBar = wrap(() => {
    return (
      <LinearGradient
        colors={['#120228', '#1c0836', '#291048']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <View cls="jcc pa3">
          <View cls="flx-row jcsb pl1 pr1 pb3">
            <TouchableOpacity onPress={this.addSongsToQueue}>
              <Image cls="widthFn-24 heightFn-25" source={Images.ic_add_song} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.removeSongs}>
              <Image cls="widthFn-24 heightFn-25" source={Images.ic_trash} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  });

  shuffeData = queue => {
    if (queue[0].flag == 'header') {
      let sliceIndex = _.findIndex(queue, q => q.order == 2);
      let queueSongs = _.cloneDeep(queue);
      if (sliceIndex >= 0) {
        queueSongs = queue.slice(0, sliceIndex);
      }
      if (queueSongs[0].flag == 'header') {
        queueSongs.shift();
      }

      const playlistSongs = queue.slice(sliceIndex, queue.length);
      playlistSongs.shift();
      rootStore.queueStore.addNewQue(queueSongs);
      rootStore.playlistSongStore.addNewPlaylist(playlistSongs);

      const newIndex = _.findIndex(
        playlistSongs,
        song => song.id == rootStore.playerStore?.currentSong.id,
      );
      rootStore.playerStore?.setTrackIndex(newIndex);
    }
  };

  onSongCheck = id => {
    const { checkedSongs } = this.state;
    const newCheckList = _.cloneDeep(checkedSongs);
    if (_.indexOf(checkedSongs, id) >= 0) {
      newCheckList.splice(_.indexOf(checkedSongs, id), 1);
    } else {
      newCheckList.push(id);
    }
    this.setState({ checkedSongs: newCheckList });
  };

  renderItem = wrap(({ item, index, drag, isActive }) => {
    return item.flag == 'header' ? (
      <GestureRecognizer onSwipeRight={this.onSwipeRight} config={this.config}>
        <View
          cls={item.order == 1 ? 'pa3 pb0 pt0' : `bt b--#7351a1 pa3 pb0 pt0`}>
          <View cls={item.order == 1 ? 'flx-row' : `pt3 flx-row`}>
            <LinearGradientText
              text={item.title}
              end={{ x: 0.6, y: 0 }}
              styles={{
                justifyContent: 'center',
                fontSize: 23,
                fontFamily: 'Averta-ExtraBold',
              }}
            />

            <View style={{ paddingTop: 3 }} cls="pa3 pr6">
              <Text cls="primaryPurple fw7 f5 avertaFont">{item.subTitle}</Text>
            </View>
          </View>
        </View>
      </GestureRecognizer>
    ) : (
      <QueueChild
        item={item}
        onSwipeRight={this.onSwipeRight}
        onSongCheck={this.onSongCheck}
        checked={_.indexOf(this.state.checkedSongs, item.id) >= 0}
        drag={drag}
        config={this.config}
        isActive={isActive}
        key={item.id.toString()}
      />
    );
  });

  onSwipeRight = () => {
    this.props._handleIndexChange(0);
  };

  render() {
    const data = [
      { flag: 'header', title: 'Danh sách chờ', order: 1 },
      ...rootStore.queueStore.songs,
    ];

    if ([...rootStore.playlistSongStore.songs].length > 0) {
      data.push({
        flag: 'header',
        title: 'Playlist :',
        subTitle: rootStore.playlistSongStore.name,
        order: 2,
      });
      [...rootStore.playlistSongStore.songs].map(song => data.push(song));
    }

    return (
      <ImageBackground cls="jcsb fullView pt2" source={Images.default_wave_bg}>
        <View style={{ height: D_HEIGHT - 112 }}>
          <DraggableFlatList
            data={data}
            ref={ref => {
              this.flatListRef = ref;
            }}
            ListHeaderComponent={this.renderQueuePlayer()}
            showsVerticalScrollIndicator={false}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => `draggable-item-${index}`}
            initialScrollIndex={
              [...rootStore.historyStore.songs].length > 4 ? data.length - 1 : 0
            }
            onScrollToIndexFailed={error => {
              if (
                [...rootStore.historyStore.songs].length !== 0 &&
                this.refs.flatListRef !== null &&
                this.refs.flatListRef !== undefined
              ) {
                this.refs.flatListRef?.scrollToOffset({
                  offset: error.averageItemLength * error.index,
                  animated: true,
                });
              }

              setTimeout(() => {
                if (
                  [...rootStore.historyStore.songs].length !== 0 &&
                  this.refs.flatListRef !== null &&
                  this.refs.flatListRef !== undefined
                ) {
                  console.log('failed 2', error);
                  this.refs.flatListRef?.scrollToOffset({
                    animated: true,
                    offset: error.index,
                  });
                }
              }, 100);
            }}
            onDragEnd={({ data }) => {
              this.shuffeData(data);
            }}
            activationDistance={30}
          />
        </View>
        <View
          cls="heightFn-56 fullWidth"
          style={{ position: 'absolute', bottom: 0 }}>
          {this.renderBottomBar()}
        </View>
      </ImageBackground>
    );
  }
}

export default Queue2;
