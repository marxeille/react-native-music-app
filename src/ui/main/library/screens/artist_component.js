import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Keyboard,
  LayoutAnimation,
} from 'react-native';
import { wrap } from '../../../../themes';
import SearchComponent from '../components/search_component';
import ArtistItem from '../components/artist_item_component';
import AlphabetSectionList from 'react-native-alphabet-sectionlist';
import { rootStore } from '../../../../data/context/root_context';
import { orderBy, uniqBy } from 'lodash';
import { observer } from 'mobx-react';
import { sortByAlphabet } from '../../../../constant/constant';

@observer
@wrap
export default class ArtistComponent extends Component {
  constructor(props) {
    super(props);

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
    this.state = {
      isActionSettingVisible: true,
    };
  }

  _listViewOffset = 0;

  _onScroll = event => {
    // Simple fade-in / fade-out animation
    const CustomLayoutLinear = {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    };
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction =
      currentOffset > 0 && currentOffset > this._listViewOffset ? 'down' : 'up';
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionSettingVisible = direction === 'up';
    if (isActionSettingVisible !== this.state.isActionSettingVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear);
      this.setState({ isActionSettingVisible });
    }
    // Update your scroll position
    this._listViewOffset = currentOffset;
  };

  renderItem = ({ item }) => {
    return (
      <>
        <ArtistItem item={item} />
      </>
    );
  };

  renderHeader = () => {
    return <View />;
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
    // const sortedArtists = sortByAlphabet(
    //   orderBy(
    //     [...rootStore?.libraryStore?.artists],
    //     [artist => artist.name.toLowerCase()],
    //     ['asc'],
    //   ),
    // );
    const sortedArtists = orderBy(
      [...rootStore?.libraryStore?.artists],
      [artist => artist.name.toLowerCase()],
      ['asc'],
    );
    const { _showModal, _hideModal } = this.props;

    return (
      <>
        <View cls="pt3 pb2">
          <SearchComponent _showModal={_showModal} _hideModal={_hideModal} />
        </View>

        <View cls="pt3" style={{ marginBottom: 95 }}>
          <View cls="fullHeight">
            {this.state.isActionSettingVisible
              ? // <View cls="ba br4 jcc asfe pa2 mb2 b--#4B3277">
                //   <TouchableOpacity>
                //     <Text cls="white fw6">Chỉ hiện DJ</Text>
                //   </TouchableOpacity>
                // </View>
                null
              : null}

            {/* <AlphabetSectionList
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
            /> */}

            <FlatList
              onScroll={this._onScroll}
              keyboardDismissMode="on-drag"
              data={uniqBy(sortedArtists, 'id')}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem}
              showsVerticalScrollIndicator={false}
              onScrollBeginDrag={Keyboard.dismiss}
              numColumns={3}
              horizontal={false}
            />
          </View>
        </View>
      </>
    );
  }
}
