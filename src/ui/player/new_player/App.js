import React, { Component } from 'react';
import Player from './Player';
import { observer } from 'mobx-react';
import { rootStore } from '../../../data/context/root_context';

export const TRACKS = [
  {
    id: '7',
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

export const TRACKS2 = [
  {
    id: '4',
    title: 'Stressed Out 2',
    artist: 'Twenty One Pilots',
    artwork:
      'http://36.media.tumblr.com/14e9a12cd4dca7a3c3c4fe178b607d27/tumblr_nlott6SmIh1ta3rfmo1_1280.jpg',
    url:
      'https://drive.google.com/uc?export=download&id=1AjPwylDJgR8DOnmJWeRgZzjsohi-7ekj',
  },
  {
    id: '5',
    title: 'Love Yourself 2',
    artist: 'Justin Bieber',
    artwork: 'https://picsum.photos/200',
    url:
      'https://drive.google.com/uc?export=download&id=1VM9_umeyzJn0v1pRzR1BSm9y3IhZ3c0E',
  },
  {
    id: '6',
    title: 'Hotline Bling 2',
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
    rootStore.updateSongs([...TRACKS, ...TRACKS2]);
    rootStore.queueStore.addNewQue(TRACKS);
  }
  render() {
    return <Player {...this.props} />;
  }
}
