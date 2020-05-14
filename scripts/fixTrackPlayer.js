const fs = require('fs');

function replaceRNVideo() {
  const content = fs.readFileSync('./scripts/Video.js').toString();
  fs.writeFileSync('./node_modules/react-native-video/Video.js', content);
}

replaceRNVideo();
