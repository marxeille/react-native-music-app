import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { wrap } from '../../../themes';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import QueueChild from './queue_child';
import DraggableFlatList from 'react-native-draggable-flatlist';

const QueueList = wrap(props => {
  const dataList = Array.isArray(props.data)
    ? props.data
    : [...props.data.values()];

  const [data, setData] = useState(dataList);

  const renderItem = useCallback(({ item, index, drag, isActive }) => {
    return (
      <QueueChild
        item={item}
        drag={drag}
        isActive={isActive}
        key={index.toString()}
      />
    );
  });

  return (
    <>
      <View cls="pa3 bb" style={{ borderBottomColor: '#7351a1' }}>
        <View cls="pl1">
          <View cls="flx-row">
            <LinearGradientText
              text={props.title}
              end={{ x: 0.6, y: 0 }}
              styles={{
                justifyContent: 'center',
                fontSize: 19,
                fontWeight: '800',
              }}
            />
            <View style={{ paddingTop: 1 }}>
              <Text cls="primaryPurple fw7 f6">{props.subTitle}</Text>
            </View>
          </View>
          {/* {data.map((item, index) => (
          <QueueChild item={item} key={index.toString()} />
        ))} */}
          <View>
            <DraggableFlatList
              data={data}
              renderItem={renderItem}
              scrollEnabled={false}
              keyExtractor={(item, index) => `draggable-item-${index}`}
              onDragEnd={({ data }) => {
                setData(data);
              }}
            />
          </View>
        </View>
      </View>
    </>
  );
});

export default QueueList;
