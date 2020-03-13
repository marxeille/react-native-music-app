import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import SearchComponent from '../components/search_component';
import PlaylistItem from '../components/playlist_item_component';
import AlphabetSectionList from 'react-native-alphabet-sectionlist';

@wrap
export default class ArtistComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.data = {
      '#': [{ name: 'A1' }, { name: 'A2' }, { name: 'A3' }],
      A: [{ name: 'A1' }, { name: 'A2' }, { name: 'A3' }],
      E: [{ name: 'E1' }, { name: 'E2' }, { name: 'E3' }, { name: 'E4' }],
      F: [{ name: 'F1' }, { name: 'F2' }, { name: 'F3' }],
      H: [{ name: 'H1' }, { name: 'H2' }, { name: 'H3' }, { name: 'H5' }],
      J: [{ name: 'J1' }, { name: 'J2' }, { name: 'J3' }, { name: 'J5' }],
      K: [{ name: 'K1' }, { name: 'K2' }, { name: 'K3' }, { name: 'K5' }],
      N: [{ name: 'N1' }, { name: 'N2' }, { name: 'N3' }, { name: 'N5' }],
      Y: [
        { name: 'Y1' },
        { name: 'Y2' },
        { name: 'Y3' },
        { name: 'Y5' },
        { name: 'Y6' },
      ],
    };
  }

  // Testing
  renderItem = ({ item }) => {
    return (
      <>
        <PlaylistItem title={'Idol kHÁ bẢnH'} img />
      </>
    );
  };

  renderHeader = () => {
    return <View></View>;
  };

  renderSectionHeader = wrap(({ section: { title } }) => {
    return (
      <View cls="pb2">
        <Text cls="primaryPurple fw6 f7">{title}</Text>
      </View>
    );
  });

  renderRightSectionItem = wrap(({ sectionId, title, index }) => {
    const active = Object.keys(this.data).indexOf(sectionId);

    return (
      <View>
        <Text
          cls="fw6"
          style={[
            // { color: active === index ? '#fff' : '#a57aae', padding: 3 },
            { color: '#a57aae', padding: 3 },
          ]}>
          {title}
        </Text>
      </View>
    );
  });
  // End test

  render() {
    return (
      <>
        <View cls="pt3">
          <SearchComponent />
        </View>
        <View cls="pt3" style={{ marginBottom: 95 }}>
          <View
            style={{ position: 'absolute' }}
            cls="ba br4 jcc asfe pa2 b--#4B3277">
            <TouchableOpacity>
              <Text cls="white fw6">Chỉ hiện DJ</Text>
            </TouchableOpacity>
          </View>
          <View cls="fullHeight">
            <AlphabetSectionList
              data={this.data}
              renderItem={this.renderItem}
              renderHeader={this.renderHeader}
              showsVerticalScrollIndicator={false}
              // custom section header
              renderSectionHeader={this.renderSectionHeader}
              // default section header styles
              // sectionHeaderStyle={{ paddingVertical: 5 }}
              rightSectionListItem={this.renderRightSectionItem}
              // sectionHeaderTextStyle={{ fontSize: 16, color: 'blue' }}
            />
          </View>
        </View>
      </>
    );
  }
}
