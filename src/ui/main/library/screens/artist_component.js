import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import SearchComponent from '../components/search_component';
import ArtistItem from '../components/artist_item_component';
import AlphabetSectionList from 'react-native-alphabet-sectionlist';
import { rootStore } from '../../../../data/context/root_context';
import { orderBy } from 'lodash';
import { observer } from 'mobx-react';
import { sortByAlphabet } from '../../../../constant/constant';

@observer
@wrap
export default class ArtistComponent extends Component {
  constructor(props) {
    super(props);
    this.data = {
      '#': [{ name: 'A1' }, { name: 'A2' }, { name: 'A3' }],
    };
  }

  renderItem = ({ item }) => {
    return (
      <>
        <ArtistItem item={item} />
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
    const artists = [...rootStore?.libraryStore?.artists];
    const sortedArtists = sortByAlphabet(
      orderBy(artists, [artist => artist.name.toLowerCase()], ['desc']),
    );

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
              data={sortedArtists}
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
