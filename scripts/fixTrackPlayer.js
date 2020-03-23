const fs = require('fs');

function replaceAudioSwift() {
  const content = fs.readFileSync('./scripts/AudioPlayer.swift').toString();
  fs.writeFileSync(
    './node_modules/react-native-track-player/ios/RNTrackPlayer/Vendor/AudioPlayer/SwiftAudio/Classes/AudioPlayer.swift',
    content,
  );
}

function replaceHook() {
  const content = fs.readFileSync('./scripts/hooks.js').toString();
  fs.writeFileSync(
    './node_modules/react-native-track-player/lib/hooks.js',
    content,
  );
}

function replaceHookD() {
  const content = fs.readFileSync('./scripts/hooks.d.ts').toString();
  fs.writeFileSync(
    './node_modules/react-native-track-player/lib/hooks.d.ts',
    content,
  );
}

function replaceRNCheckox() {
  const content = fs.readFileSync('./scripts/indexRNCheckbox.js').toString();
  fs.writeFileSync('./node_modules/react-native-check-box/index.js', content);
}

replaceAudioSwift();
replaceHookD();
replaceHook();
replaceRNCheckox();
