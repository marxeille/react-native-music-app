export const BASE_API_URL = 'http://103.28.37.44:5000';

export const AsyncStorageKey = {
  USERINFO: '@userinfo',
  RECENTLYSEARCH: {
    SONGS: '@recentlysongs',
    ARTISTS: '@recentlyartists',
    ALBUMS: '@recentlyalbums',
  },
};

export const alphabetJson = [
  '0-9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

export function sortByAlphabet(arr) {
  const sortedObj = {};
  arr.map(element => {
    if (!element.getName().match('[^a-zA-Z]')) {
      if (typeof sortedObj['0-9'] == 'undefined') {
        sortedObj['0-9'] = [];
        sortedObj['0-9'].push(element);
      } else {
        sortedObj['0-9'].push(element);
      }
    }
    alphabetJson.reverse().map(letter => {
      if (
        element
          .getName()
          .toUpperCase()
          .startsWith(letter)
      ) {
        if (typeof sortedObj[letter] == 'undefined') {
          sortedObj[letter] = [];
          sortedObj[letter].push(element);
        } else {
          sortedObj[letter].push(element);
        }
      }
    });
  });
  return sortedObj;
}
