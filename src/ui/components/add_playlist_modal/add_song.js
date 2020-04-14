import React, { useCallback, useState } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import LinearGradient from 'react-native-linear-gradient';
import SearchBar from '../../main/search/components/search_bar';
import { subLongStr } from '../../../utils';
import { rootStore } from '../../../data/context/root_context';

const AddSongPlaylist = observer(
  wrap(props => {
    let timeout = 0;
    const [keyword, setKeyword] = useState('');
    const onChangeKeyword = keyword => {
      setKeyword(keyword);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        //search function
        if (keyword !== '') console.log('keyword', keyword);
      }, 1300);
    };
    const onFocus = useCallback(() => {});
    const renderEmptyContainer = useCallback(
      wrap(() => (
        <View cls="aic jcc pt3">
          <Text cls="lightFont white">Không có dữ liệu</Text>
        </View>
      )),
    );
    const renderItem = useCallback(
      wrap(item => {
        return (
          <View cls="fullWidth">
            <SearchItem item={item.item} />
          </View>
        );
      }),
    );
    const renderHeader = useCallback(
      wrap(() => {
        return (
          <LinearGradient
            colors={['#291047', '#1a0632', '#110926', '#110926']}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}>
            <View cls="pv2 flx-row aic">
              <View cls="aifs jcc flx-i">
                <TouchableOpacity
                  onPress={() => props.toggleAddSong(false)}
                  cls="jcc pv1 ph3 aic">
                  <Image source={Images.ic_delete} />
                </TouchableOpacity>
              </View>
              <View cls="aic jcc flexFn-5 pt2">
                <LinearGradientText
                  text={`Thêm bài hát`}
                  end={{ x: 0.7, y: 0 }}
                  styles={{
                    justifyContent: 'center',
                    fontSize: 21,
                    fontWeight: '800',
                  }}
                />
              </View>
              <View cls="flx-i" />
            </View>
          </LinearGradient>
        );
      }),
    );
    return (
      <View cls="pb5">
        {renderHeader()}
        <View cls="pa3 pb0 aic">
          <SearchBar
            placeHolder={'Tìm bài hát'}
            keyword={keyword}
            onChangeKeyword={onChangeKeyword}
            onFocus={onFocus}
          />
        </View>
        <FlatList
          data={[...rootStore?.homeStore?.popularSongs]}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyContainer}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }),
);

export default AddSongPlaylist;

const SearchItem = observer(
  wrap(props => (
    <View cls="jcsb flx-row aic pb2 pt2 pa3 fullWidth">
      <View cls="flx-row">
        <Image cls="squareFn-50" source={{ uri: props.item.getThumb() }} />

        <View cls="jcc pl3">
          <Text cls="white fw7 f6 lightFont">
            {subLongStr(props.item.getName(), 25)}
          </Text>
          <Text cls="primaryPurple lightFont">{props.item.getSubTitle()}</Text>
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={() => {}}>
          <Image source={Images.ic_plus} />
        </TouchableOpacity>
      </View>
    </View>
  )),
);
