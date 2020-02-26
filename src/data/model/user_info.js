export default class UserInfo {
  constructor(json) {
    this.name = json['name'];
    this.uid = json['uid'];
    this.accessToken = json['access_token'];
    this.refreshToken = json['refresh_token'];
  }


  toJsonString = () => {
    return JSON.stringify(this)
  }
}