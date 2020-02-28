import { PlayList } from '../model/playlist';
//Hanle data từ Api Services
export default class CommonApiService {
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
}