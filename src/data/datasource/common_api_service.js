import { PlayList } from '../model/playlist';
import Axios from 'axios';
import { instanceAxios } from './api_config';
//Hanle data từ Api Services
export default class CommonApiService {
  testAxios() {
    return instanceAxios.get('/list_music');
  }

  getSongsOfAlBum(index) {
    return new Promise(resolve => {
      resolve([
        {
          id: '5',
          title: 'Vinahey',
          artist: 'hey hey',
          favorite: false,
          url:
            'https://drive.google.com/uc?export=download&id=1AjPwylDJgR8DOnmJWeRgZzjsohi-7ekj',
          artwork:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
        {
          id: '6',
          title: '999 đoá hồng',
          artist: 'hey hey hey',
          favorite: false,
          url:
            'https://drive.google.com/uc?export=download&id=1AjPwylDJgR8DOnmJWeRgZzjsohi-7ekj',
          artwork:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
        {
          id: '7',
          title: 'Cục xì lầu ông bê lắp',
          artist: 'hey',
          favorite: false,
          url:
            'https://drive.google.com/uc?export=download&id=1AjPwylDJgR8DOnmJWeRgZzjsohi-7ekj',
          artwork:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
      ]);
    });
  }

  getHomeAlbums() {
    return new Promise(resolve => {
      resolve([
        {
          id: '1',
          name: 'Album 1',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
        {
          id: '2',
          name: 'Album 2',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
        {
          id: '3',
          name: 'Album 3',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
      ]);
    });
  }

  //Lấy danh sách album gần đây
  getRecentlyPlaylist() {
    return new Promise(resolve => {
      resolve([
        {
          id: '1',
          name: 'Daily Mix 1',
          artist: '',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
        {
          id: '2',
          name: 'Daily Mix 1',
          artist: '',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
        {
          id: '3',
          name: 'Daily Mix 1',
          artist: '',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
      ]);
    });
  }
  //Lấy danh sách PlayList phổ biến
  getPopularPlayList() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: 'Daily Mix 1',
            artist: '',
            thumb:
              'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
          },
          {
            id: '2',
            name: 'Daily Mix 1',
            artist: '',
            thumb:
              'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
          },
          {
            id: '3',
            name: 'Daily Mix 1',
            artist: '',
            thumb:
              'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
          },
        ]);
      }, 2000);
    });
  }

  //Lấy danh sách PlayList dành cho user
  getSuggestPlayList() {
    return new Promise(resolve => {
      resolve([
        {
          id: '1',
          name: 'Daily Mix 1',
          artist: '',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
        {
          id: '2',
          name: 'Daily Mix 1',
          artist: '',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
        {
          id: '3',
          name: 'Daily Mix 1',
          artist: '',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
      ]);
    });
  }

  //Lấy danh sách album gần đây
  getPlaylistOfUser() {
    return new Promise(resolve => {
      resolve([
        {
          id: '1',
          name: 'Daily Mix 1',
          artist: 'Tim',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
        {
          id: '4',
          name: 'Daily Mix 2',
          artist: 'Hồ Ngọc Hà',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
        {
          id: '5',
          name: 'Daily Mix 3',
          artist: 'Vũ',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
        {
          id: '6',
          name: 'Daily Mix 6',
          artist: 'Vũ',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
        {
          id: '6',
          name: 'Daily Mix 6',
          artist: 'Vũ',
          thumb:
            'https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg',
        },
      ]);
    });
  }
}
