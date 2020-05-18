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
    _handleLoadMore,
  }) => {
    const _renderItem = useCallback(
      wrap(item => {
        return (
          <View cls="pa3 pt0">
            <AlbumItem
              playSong={playSong}
              item={item.item}
              openModal={_showModal}
              model={viewModel}
            />
          </View>
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
          onEndReached={_handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
        />
      </View>
    );
  },
);

export default AlbumListItem;
