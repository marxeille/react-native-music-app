//Hanle data từ Api Services
class CommonApiService {
  //Lấy danh sách album gần đ
  async getRecentlyPlaylist() {
    return [
      PlayList(),
      PlayList(),
    ]

  }
  //Lấy danh sách PlayList phổ biến
  async getPopularPlayList() {
    return [
      PlayList(),
      PlayList(),
    ]
  }

  //Lấy danh sách PlayList dành cho user
  async getSuggestPlayList() {
    return [
      PlayList(),
      PlayList(),
    ]
  }
}