import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { wrap } from '../../../themes';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import QueueChild from './queue_child';
import DraggableFlatList from 'react-native-draggable-flatlist';
// import TrackPlayer from 'react-native-track-player';
import { observer } from 'mobx-react';

const QueueList = observer(
  wrap(props => {
    const dataList = Array.isArray(props.data)
      ? props.data
      : [...props.data.values()];

    const [data, setData] = useState(dataList);

    const shuffeData = useCallback(async data => {
      if (props.type == 'queue') {
        props.shuffeData(data);
        setData(data);
        return;
      }
      setData(data);
    });

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
                  fontSize: 20,
                  fontFamily: 'Averta-ExtraBold',
                }}
              />
              <View style={{ paddingTop: 3 }}>
                <Text cls="primaryPurple fw7 f6 avertaFont">
                  {props.subTitle}
                </Text>
              </View>
            </View>
            <View>
              <DraggableFlatList
                data={data}
                renderItem={renderItem}
                scrollEnabled={false}
                keyExtractor={(item, index) => `draggable-item-${index}`}
                onDragEnd={({ data }) => {
                  shuffeData(data);
                }}
              />
            </View>
          </View>
        </View>
      </>
    );
  }),
);

export default QueueList;
