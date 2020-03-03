import { PlayList } from '../model/playlist';
import Axios from 'axios'
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
          id: '1',
          name: 'Quên',
          artist: 'Chi Dân',
          favorite: false,
          thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
        },
        {
          id: '2',
          name: 'Khi phải xa nhau',
          artist: 'Hồ Quang Hiếu',
          favorite: true,
          thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
        },
        {
          id: '3',
          name: 'Đường một chiều',
          artist: 'Tim',
          favorite: true,
          thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
        }
      ]);
    })
  }

  //Lấy danh sách album gần đây
  getRecentlyPlaylist() {
    return new Promise(resolve => {
      resolve([
        {
          id: '1',
          name: 'Daily Mix 1',
          artist: '',
          thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
        },
        {
          id: '2',
          name: 'Daily Mix 1',
          artist: '',
          thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
        },
        {
          id: '3',
          name: 'Daily Mix 1',
          artist: '',
          thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
        }
      ]);
    })
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
            thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
          },
          {
            id: '2',
            name: 'Daily Mix 1',
            artist: '',
            thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
          },
          {
            id: '3',
            name: 'Daily Mix 1',
            artist: '',
            thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
          }
        ]);
      }, 2000);
    })
  };

  //Lấy danh sách PlayList dành cho user
  getSuggestPlayList() {
    return new Promise(resolve => {
      resolve([
        {
          id: '1',
          name: 'Daily Mix 1',
          artist: '',
          thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
        },
        {
          id: '2',
          name: 'Daily Mix 1',
          artist: '',
          thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
        },
        {
          id: '3',
          name: 'Daily Mix 1',
          artist: '',
          thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
        }
      ]);
    })
  };

  //Lấy danh sách album gần đây
  getPlaylistOfUser() {
    return new Promise(resolve => {
      resolve([
        {
          id: '1',
          name: 'Daily Mix 1',
          artist: '',
          thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
        },
        {
          id: '2',
          name: 'Daily Mix 2',
          artist: '',
          thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
        },
        {
          id: '3',
          name: 'Daily Mix 3',
          artist: '',
          thumb: "https://photo-resize-zmp3.zadn.vn/w480_r1x1_jpeg/cover/6/f/3/6/6f3688c38de70cd69dd2919d6a7ad318.jpg",
        }
      ]);
    })
  }
}