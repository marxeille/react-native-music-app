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
import { SearchModel } from './view_model';
import Loading from '../../components/loading';
import { observer } from 'mobx-react';
@observer
@wrap
export default class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHistory: false,
      keyword: null,
    };
    this.viewmodel = SearchModel.create({ state: 'loading' });
    this.timeout = 0;
  }

  componentDidMount() {
    this.viewmodel.getRecentlySong();
  }

  onChangeKeyword = keyword => {
    this.setState({ keyword: keyword });
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      //search function
      this.viewmodel.searchByKeyword(keyword);
    }, 800);
  };

  onFocus = () => {
    this.setState({ showHistory: true });
  };

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
              <SearchBar
                keyword={this.state.keyword}
                onChangeKeyword={this.onChangeKeyword}
                onFocus={this.onFocus}
              />
              <Text cls="white fw6 f10">
                {this.state.keyword || this.state.showHistory
                  ? 'Tìm gần đây'
                  : 'Duyệt tìm tất cả'}
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
            <TouchableOpacity>
              <Text cls="primaryPurple pt3 fw6 f6">Hey hey hey ${item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  });

  renderSearchItem = wrap(item => {
    return (
      <>
        <SearchItem item={item.item} model={this.viewmodel} />
      </>
    );
  });

  render() {
    const { showHistory, keyword } = this.state;

    if (this.viewmodel.state == 'loading')
      return (
        <ImageBackground cls="fullView aic jcc" source={Images.bg}>
          <Loading />
        </ImageBackground>
      );

    return (
      <ImageBackground cls="fullView" source={Images.bg}>
        {this.renderSearchSection()}
        {keyword || showHistory ? (
          <View cls="pa3 pt0 fullView">
            <FlatList
              data={[...this.viewmodel.recentlySong.values()]}
              showsVerticalScrollIndicator={false}
              renderItem={this.renderSearchItem}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={{ position: 'absolute', right: 12, bottom: 225 }}>
              <TouchableOpacity onPress={this.viewmodel.removeAllRecently}>
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
