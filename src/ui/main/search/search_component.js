import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../library/components/LinearGradientText';
import { getStatusBarHeight } from '../../../utils';
import LinearGradient from 'react-native-linear-gradient';
import SearchBar from './components/search_bar';
import SearchItem from './components/search_item';

@wrap
export default class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHistory: true,
    };
  }

  renderSearchSection = () => {
    return (
      <>
        <LinearGradient
          colors={['#120228', '#1c0836', '#291048']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <View style={{ paddingTop: getStatusBarHeight() }}>
            <View cls="pa3">
              <LinearGradientText
                text={'Tìm kiếm'}
                end={{ x: 0.2, y: 0 }}
                styles={{
                  justifyContent: 'center',
                  fontSize: 21,
                  fontWeight: '800',
                }}
              />
              <SearchBar />
              <Text cls="white fw6 f10">
                {this.state.showHistory ? 'Tìm gần đây' : 'Duyệt tìm tất cả'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </>
    );
  };

  renderResultSection = wrap((title, data) => {
    return (
      <View cls="pt4">
        <View cls="flx-row aife">
          <Text cls="white fw8 f5">{title}</Text>
          <View cls="bg-#4b3277 heightFn-1 fullWidth flx-i mb1"></View>
        </View>
        <View>
          {data.map(item => (
            <Text cls="primaryPurple pt3 fw6 f6">Hey hey hey ${item}</Text>
          ))}
        </View>
      </View>
    );
  });

  renderSearchItem = wrap(item => {
    return (
      <>
        <SearchItem />
      </>
    );
  });

  render() {
    const { showHistory } = this.state;
    return (
      <ImageBackground cls="fullView" source={Images.bg}>
        {this.renderSearchSection()}
        {showHistory ? (
          <View cls="pa3 pt0" style={{ marginBottom: 185 }}>
            <FlatList
              data={[1, 2, 3, 4, 5, 6, 8, 9]}
              showsVerticalScrollIndicator={false}
              renderItem={this.renderSearchItem}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={{ position: 'absolute', right: 12, bottom: 25 }}>
              <TouchableOpacity>
                <View
                  cls="ba pa2 pt1 pb1 br5"
                  style={{ borderColor: '#d8a1c8' }}>
                  <Text cls="white">Xoá tất cả</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <ScrollView contentContainerCls="pa3 pt1">
            <View>{this.renderResultSection('Nghệ sĩ', [1, 2, 3])}</View>
            <View>
              {this.renderResultSection('Bài hát hey hey', [1, 2, 3, 4])}
            </View>
          </ScrollView>
        )}
      </ImageBackground>
    );
  }
}
