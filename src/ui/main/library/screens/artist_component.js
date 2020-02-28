import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import SearchComponent from '../components/search_component';
import PlaylistItem from '../components/playlist_item_component';

@wrap
export default class ArtistComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderPlaylist = item => {
    return (
      <>
        <PlaylistItem title={'Idol kHÁ bẢnH'} img />
      </>
    );
  };

  render() {
    return (
      <>
        <View cls="pt3">
          <SearchComponent />
        </View>
        <View cls="pt3">
          <View
            style={{ position: 'absolute' }}
            cls="ba br4 jcc asfe pa2 b--#4B3277">
            <TouchableOpacity>
              <Text cls="white fw6">Chỉ hiện DJ</Text>
            </TouchableOpacity>
          </View>
          <View cls="fullHeight">
            <FlatList
              data={[1, 2, 3, 4]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderPlaylist}
            />
          </View>
        </View>
      </>
    );
  }
}
