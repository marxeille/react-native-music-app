import React, { useCallback, useState, useRef, useMemo } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Keyboard,
} from 'react-native';
import { observer } from 'mobx-react';
import { wrap } from '../../../themes';
import Images from '../../../assets/icons/icons';
import LinearGradientText from '../../main/library/components/LinearGradientText';
import LinearGradient from 'react-native-linear-gradient';
import SearchBar from '../../main/search/components/search_bar';
import { subLongStr, isSmallDevice, getStatusBarHeight } from '../../../utils';
import { rootStore } from '../../../data/context/root_context';
import Loading from '../../components/loading';
import { CreatePlaylistModel } from './model/view_model';
import { likeHelper, unlikeHelper } from '../../../data/datasource/api_helper';

const AddSongPlaylist = observer(
  wrap(props => {
    let timeout = useRef(null);
    let viewModel =
      props.viewModel ??
      useRef(CreatePlaylistModel.create({ state: 'success', name: '' }));
    const [keyword, setKeyword] = useState('');
    const trackIds = [...viewModel?.current?.songs.values()].map(
      track => track.id,
    );

    const onChangeKeyword = keyword => {
      setKeyword(keyword);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        //search function
        if (keyword !== '') viewModel.current.searchByKeyword(keyword);
      }, 1300);
    };

    const onSuccess = useCallback((type, data) => {
      const idExist = [...rootStore.likedTracks].includes(Number(data));
      if (type == 'like') {
        if (!idExist) {
          rootStore.addLikedTrack(data);
        }
      } else {
        if (idExist) {
          rootStore.removeLikedTrack(data);
        }
      }
    });

    const onError = useCallback((type, data) => {});

    const onFocus = useCallback(() => {});
    const addSong = useCallback(async song => {
      if (!props.isFavorite) {
        if (!viewModel.current.songs.get(song.id)) {
          viewModel.current.putSong(song);
        } else {
          viewModel.current.removeSong(song);
        }
      } else {
        if (![...rootStore.likedTracks].includes(Number(song.id))) {
          await likeHelper('track', song.id, onSuccess, onError);
          props.parentModel?.setSongs(song);
        } else {
          await unlikeHelper('track', song.id, onSuccess, onError);
        }
      }
    });
    const renderEmptyContainer = useMemo(
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
            <SearchItem
              item={item.item}
              addSong={addSong}
              isFavorite={props.isFavorite}
              checked={trackIds.includes(item.item.id)}
            />
          </View>
        );
      }),
    );
    const handleCloseAction = useCallback(() => {
      typeof props.handleRightAction == 'function' && !props.isFavorite
        ? props.handleRightAction([...viewModel.current.songs.values()])
        : props.toggleAddSong(false);
    });
    const renderHeader = useCallback(
      wrap(() => {
        return (
          <LinearGradient
            colors={['#291047', '#1a0632', '#110926', '#110926']}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}>
            <View
              cls="pv2 flx-row aic"
              style={{ paddingTop: getStatusBarHeight() + 10 }}>
              <View cls="aifs jcc flx-i">
                <TouchableOpacity
                  onPress={handleCloseAction}
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
      <View style={{ height: '100%' }}>
        {renderHeader()}
        <View cls="pa3 pb0 aic">
          <SearchBar
            placeHolder={'Tìm bài hát'}
            keyword={keyword}
            onChangeKeyword={onChangeKeyword}
            onFocus={onFocus}
          />
        </View>
        {viewModel.state == 'loading' ? (
          <Loading />
        ) : (
          <FlatList
            data={
              keyword == ''
                ? [...rootStore?.homeStore?.popularSongs]
                : [...viewModel.current.searchResult.values()]
            }
            style={{ height: '100%' }}
            renderItem={renderItem}
            onScrollBeginDrag={Keyboard.dismiss}
            ListEmptyComponent={renderEmptyContainer}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    );
  }),
);

export default AddSongPlaylist;

const SearchItem = observer(
  wrap(props => {
    const toggleAddSong = useCallback(() => {
      if (props) props.addSong(props.item);
    });
    return (
      <View cls="flx-row aic pb2 pt2 pa3 fullWidth">
        <Image
          cls="squareFn-50"
          source={
            typeof props.item?.getThumb == 'function' &&
            props.item?.getThumb() !== ''
              ? { uri: props.item?.getThumb() }
              : Images.bAAlbum
          }
        />
        <View cls="flx-i flx-wrap">
          <View cls="jcc pl3 pr3">
            <Text
              cls={`${isSmallDevice() ? 'f8' : 'f6'} white fw7 lightFont`}
              numberOfLines={1}
              ellipsizeMode="tail">
              {props.item && typeof props.item?.getName == 'function'
                ? props.item?.getName()
                : ''}
            </Text>
            <Text
              cls={`${isSmallDevice() ? 'f9' : ''} primaryPurple lightFont`}
              numberOfLines={1}
              ellipsizeMode="tail">
              {props.item && typeof props.item?.getSubTitle == 'function'
                ? props.item.getSubTitle()
                : ''}
            </Text>
          </View>
        </View>
        <View cls="flx-row">
          <TouchableOpacity onPress={() => toggleAddSong()}>
            {props.isFavorite ? (
              <Image
                cls="widthFn-24 heightFn-24"
                source={
                  [...rootStore.likedTracks].includes(Number(props.item.id))
                    ? Images.ic_del_song
                    : Images.ic_plus
                }
              />
            ) : (
              <Image
                cls="widthFn-24 heightFn-24"
                source={props.checked ? Images.ic_del_song : Images.ic_plus}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }),
);
