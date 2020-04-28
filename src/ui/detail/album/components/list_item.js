import React, { useCallback } from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { wrap } from '../../../../themes';
import AlbumItem from './album_item';

const AlbumListItem = wrap(
  ({
    _renderListHeaderContent,
    hasSong,
    songs,
    playSong,
    _showModal,
    viewModel,
  }) => {
    const _renderItem = useCallback(
      wrap(item => {
        return (
          <TouchableOpacity onPress={() => playSong(item.item)}>
            <View cls="pa3 pt0">
              <AlbumItem
                item={item.item}
                openModal={_showModal}
                model={viewModel}
              />
            </View>
          </TouchableOpacity>
        );
      }),
    );
    return (
      <View>
        <FlatList
          ListHeaderComponent={() => _renderListHeaderContent(hasSong)}
          data={songs}
          showsVerticalScrollIndicator={false}
          renderItem={_renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  },
);

export default AlbumListItem;