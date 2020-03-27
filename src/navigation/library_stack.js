import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LibraryComponent from '../ui/main/library';
import AlbumDetail from '../ui/detail/album/album_detail';
import ArtistDetail from '../ui/detail/artist/artist_detail';

const Stack = createStackNavigator();

export default function homeContainer() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="lib" component={LibraryComponent} />
      <Stack.Screen name="artist_detail" component={ArtistDetail} />
      <Stack.Screen name="album_detail" component={AlbumDetail} />
    </Stack.Navigator>
  );
}
