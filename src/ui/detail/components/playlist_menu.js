import React, { useCallback, useState } from 'react';
import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { wrap } from '../../../themes';
import { observer } from 'mobx-react';
import Images from '../../../assets/icons/icons';
import DraggableFlatList from 'react-native-draggable-flatlist';

const PlaylistMenu = observer(
  wrap(props => {
    const [data, setData] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const renderHeader = useCallback(
      wrap(() => {
        return (
          <View cls="aic pa3 pt0 pb4">
            <Text cls="fw8 f3 white">Playlist Menu</Text>
          </View>
        );
      }),
    );

    const renderItem = useCallback(({ item, index, drag, isActive }) => {
      return (
        <PlaylistItem
          item={item}
          drag={drag}
          isActive={isActive}
          // key={index.toString()}
        />
      );
    });

    return (
      <View cls="pa3 fullView">
        <DraggableFlatList
          ListHeaderComponent={renderHeader()}
          data={data}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `draggable-item-${index}`}
          onDragEnd={({ data }) => {
            setData(data);
          }}
        />
      </View>
    );
  }),
);

export default PlaylistMenu;

const PlaylistItem = wrap(props => {
  return (
    <View cls={`flx-row pb3 jcsb aic ${props.isActive ? 'bg-#1c0836' : ''}`}>
      <View cls="flx-row aic">
        <TouchableOpacity>
          <Image source={Images.ic_del_song} />
        </TouchableOpacity>
        <View cls="pl3">
          <Text cls="white fw7 f6">song name {props.item}</Text>
          <Text cls="primaryPurple f7 pt1">song artist {props.item}</Text>
        </View>
      </View>
      <TouchableOpacity onLongPress={props.drag}>
        <Image source={Images.ic_move} />
      </TouchableOpacity>
    </View>
  );
});
