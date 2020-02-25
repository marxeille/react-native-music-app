class Album {
  constructor(json) {
    this.name = json['name'];
    this.thumb = json['thumb'];
  }

  getName = () => {
    return this.name;
  }

  getThumb = () => {
    return this.thumb;
  }
}