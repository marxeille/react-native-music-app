import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchComponent from '../ui/main/search';
import AlbumDetail from '../ui/detail/album/album_detail';
import PlaylistDetail from '../ui/detail/playlist/playlist_detail';
const Stack = createStackNavigator();

export default function homeContainer() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="search" component={SearchComponent} />
      <Stack.Screen name="album_detail" component={AlbumDetail} />
      <Stack.Screen name="playlist_detail" component={PlaylistDetail} />
    </Stack.Navigator>
  );
}
