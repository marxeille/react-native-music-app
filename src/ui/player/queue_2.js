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
import { subLongStr, D_HEIGHT } from '../../utils';
import DraggableFlatList from 'react-native-draggable-flatlist';
import LinearGradientText from '../main/library/components/LinearGradientText';
import * as _ from 'lodash';

@observer
@wrap
class Queue2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedSongs: [],
    };
  }

  renderQueuePlayer = wrap(() => {
    const { statusPlayer, toggleStatus, currentSong } = rootStore.playerStore;
    return (
      <View>
        <ImageBackground
          cls="fullWidth heightFn-72 flx-row aic jcsb pl3 pr3"
          source={Images.bg_player}>
          <View cls="flx-row aic">
            <Image
              source={{
                uri: rootStore.playerStore.currentSong?.getThumb(),
              }}
              cls="widthFn-52 heightFn-52 mr3"
            />
            <View>
              <Text cls="white fw7 f6 latoFont">
                {currentSong !== null
                  ? subLongStr(currentSong?.getName(), 25)
                  : 'Dèfault Title'}
              </Text>
              <Text cls="primaryPurple f9 pt1 latoFont">
                Idol {currentSong?.getSubTitle()} bẢnH
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
      </View>
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
              <Image cls="widthFn-24 heightFn-25" source={Images.ic_add_song} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                rootStore?.queueStore?.removeSongs(this.state.checkedSongs)
              }>
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
      const queueSongs = queue.slice(0, sliceIndex);
      queueSongs.shift();
      const playlistSongs = queue.slice(sliceIndex, queue.length);
      playlistSongs.shift();
      rootStore.queueStore.addNewQue(queueSongs);
      // this.setState({ playlist: playlistSongs });
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
      <View cls={item.order == 1 ? '' : `bt b--#7351a1`}>
        <View cls={item.order == 1 ? 'flx-row' : `pt3 flx-row`}>
          <LinearGradientText
            text={item.title}
            end={{ x: 0.6, y: 0 }}
            styles={{
              justifyContent: 'center',
              fontSize: 20,
              fontFamily: 'Averta-ExtraBold',
            }}
          />

          <View style={{ paddingTop: 2 }}>
            <Text cls="primaryPurple fw7 f6 avertaFont">{item.subTitle}</Text>
          </View>
        </View>
      </View>
    ) : (
      <QueueChild
        item={item}
        onSongCheck={this.onSongCheck}
        checked={_.indexOf(this.state.checkedSongs, item.id) >= 0}
        drag={drag}
        isActive={isActive}
        key={item.id.toString()}
      />
    );
  });

  render() {
    const data = [
      { flag: 'header', title: 'Danh sách chờ', order: 1 },
      ...rootStore.queueStore.songs,
    ];
    if ([...rootStore.playlistSongStore.songs].length > 0) {
      data.push({
        flag: 'header',
        title: 'Playlist : ',
        subTitle: 'Best Remix',
        order: 2,
      });
      [...rootStore.playlistSongStore.songs].map(song => data.push(song));
    }

    return (
      //   <View cls="jcsb fullView">
      <ImageBackground cls="jcsb fullView pt2" source={Images.bg3}>
        {this.renderQueuePlayer()}
        <View cls="pa3" style={{ height: D_HEIGHT - 112, paddingBottom: 56 }}>
          <DraggableFlatList
            data={data}
            // ListHeaderComponent={this.renderQueuePlayer()}
            showsVerticalScrollIndicator={false}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => `draggable-item-${index}`}
            onDragEnd={({ data }) => {
              this.shuffeData(data);
            }}
          />
        </View>
        <View
          cls="heightFn-56 fullWidth"
          style={{ position: 'absolute', bottom: 0 }}>
          {this.renderBottomBar()}
        </View>
      </ImageBackground>
      //   </View>
    );
  }
}

export default Queue2;
