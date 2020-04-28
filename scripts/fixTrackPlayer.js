const fs = require('fs');

function replaceRNCheckox() {
  const content = fs.readFileSync('./scripts/indexRNCheckbox.js').toString();
  fs.writeFileSync('./node_modules/react-native-check-box/index.js', content);
}

replaceRNCheckox();
