import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchComponent from '../ui/main/search';
import ArtistDetail from '../ui/detail/artist/artist_detail';
import PlaylistDetail from '../ui/detail/playlist/playlist_detail';
const Stack = createStackNavigator();

export default function homeContainer() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="search" component={SearchComponent} />
      <Stack.Screen name="artist_detail" component={ArtistDetail} />
      <Stack.Screen name="playlist_detail" component={PlaylistDetail} />
    </Stack.Navigator>
  );
}
