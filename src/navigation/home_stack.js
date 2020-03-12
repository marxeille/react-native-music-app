import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeComponent from '../ui/main/home';
import AlbumDetail from '../ui/detail/album/album_detail';
import PlaylistDetail from '../ui/detail/playlist/playlist_detail';
const Stack = createStackNavigator();

export default function homeContainer() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="home" component={HomeComponent} />
      <Stack.Screen name="album_detail" component={AlbumDetail} />
      <Stack.Screen name="playlist_detail" component={PlaylistDetail} />
    </Stack.Navigator>
  );
}
