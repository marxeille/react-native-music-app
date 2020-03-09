import React, { Component } from 'react';
import { View, ScrollView, Image, ImageBackground, Text } from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../themes';
import Images from '../../assets/icons/icons';
import QueueChild from './components/queue_child';
import LinearGradientText from '../main/library/components/LinearGradientText';
import LinearGradient from 'react-native-linear-gradient';

@observer
@wrap
class Queue extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderWaitList = wrap(() => {
    return (
      <View cls="pa3 bb" style={{ borderBottomColor: '#7351a1' }}>
        <View cls="pl1">
          <LinearGradientText
            text={'Danh sách chờ'}
            end={{ x: 0.4, y: 0 }}
            styles={{
              justifyContent: 'center',
              fontSize: 19,
              fontWeight: '800',
            }}
          />
          {[1, 2, 3].map((index, item) => (
            <QueueChild checked={index % 2 == 1} key={index.toString()} />
          ))}
        </View>
      </View>
    );
  });

  renderQueuePlayer = wrap(() => {
    return (
      <>
        <ImageBackground
          cls="fullWidth heightFn-72 flx-row aic jcsb pl3 pr3"
          source={Images.bg_player}>
          <View cls="flx-row aic">
            <Image
              source={require('../../assets/images/khabanh.png')}
              cls="widthFn-52 heightFn-52 mr2"
            />
            <View>
              <Text cls="white fw7 f7">Vinahey hey heey heeey</Text>
              <Text cls="primaryPurple f9 pt1">Idol khÁ bẢnH</Text>
            </View>
          </View>
          <Image cls="widthFn-52 heightFn-52" source={Images.ic_play_large} />
        </ImageBackground>
      </>
    );
  });

  render() {
    return (
      <View cls="jcsb fullView">
        <View>
          <ScrollView>
            <View cls="pa3 pb2 bb" style={{ borderBottomColor: '#7351a1' }}>
              <QueueChild checked />
            </View>
            {this.renderQueuePlayer()}
            {this.renderWaitList()}
            {this.renderWaitList()}
          </ScrollView>
        </View>
        <LinearGradient
          colors={['#120228', '#1c0836', '#291048']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <View cls="fullWidth heightFn-60 jcc pa3">
            <View cls="flx-row jcsb pl1 pr1 pb3">
              <Image source={Images.ic_add_song} />
              <Image source={Images.ic_trash} />
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

export default Queue;
