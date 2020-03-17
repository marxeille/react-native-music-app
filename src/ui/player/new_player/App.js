import React, { Component } from 'react';
import Player from './Player';
import { observer } from 'mobx-react';
import { rootStore } from '../../../data/context/root_context';

export const TRACKS = [
  {
    id: '1',
    title: 'Stressed Out',
    artist: 'Twenty One Pilots',
    artwork:
      'http://36.media.tumblr.com/14e9a12cd4dca7a3c3c4fe178b607d27/tumblr_nlott6SmIh1ta3rfmo1_1280.jpg',
    url:
      'https://drive.google.com/uc?export=download&id=1AjPwylDJgR8DOnmJWeRgZzjsohi-7ekj',
  },
  {
    id: '2',
    title: 'Love Yourself',
    artist: 'Justin Bieber',
    artwork: 'https://picsum.photos/200',
    url:
      'https://drive.google.com/uc?export=download&id=1VM9_umeyzJn0v1pRzR1BSm9y3IhZ3c0E',
  },
  {
    id: '3',
    title: 'Hotline Bling',
    artist: 'Drake',
    artwork:
      'https://upload.wikimedia.org/wikipedia/commons/c/c9/Drake_-_Hotline_Bling.png',
    url:
      'https://drive.google.com/uc?export=download&id=1bmvPOy2IVbkUROgm0dqiZry_miiL4OqI',
  },
];

@observer
export default class App extends Component {
  constructor(props) {
    super(props);
    rootStore.updateSongs(TRACKS);
    rootStore.queueStore.addSongs(TRACKS);
  }
  render() {
    return <Player />;
  }
}
