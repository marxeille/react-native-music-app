import { Dimensions, Platform, StatusBar } from 'react-native';
import unorm from 'unorm';

export const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

export const mapValue = (object, iteratee) => {
  object = Object(object);
  const result = {};

  Object.keys(object).forEach(key => {
    result[key] = iteratee(object[key], key, object);
  });
  return result;
};

export function isTextEmpty(value) {
  return !value || value.length === 0;
}

/**
 *
 * @param {object} ref - reference of the conponent
 *
 * The initial watchDog is actually the height of the React tree.
 * Then watchDog will be the flag when we find the wrapped component.
 */
export const getReduxComponentRef = (ref, methodName) => {
  if (!ref) {
    return;
  }
  let element = ref;
  let watchDog = 10;
  while (element._reactInternalFiber && watchDog > 0) {
    if (element[methodName]) {
      return element;
    }
    element =
      element._reactInternalFiber.child &&
      element._reactInternalFiber.child.stateNode;
    watchDog--;
  }
  return;
};

export const normalizeMoney = money =>
  money?.toString().replace(/[^0-9 ]/g, '');

export const transformMoney = money => {
  const normalizedMoney = normalizeMoney(money ? money : 0);
  const length = normalizedMoney?.length;

  let realMoney = 0;

  if (length <= 3) {
    realMoney = normalizedMoney;
  } else if (length % 3 === 0) {
    let res = normalizedMoney?.substring(0, 3);
    for (let i = 3; i < length; i += 3) {
      res += `.${normalizedMoney?.substring(i, i + 3)}`;
    }
    realMoney = res;
  } else if (length % 3 === 1) {
    let res = normalizedMoney[0];
    for (let i = 1; i < length; i += 3) {
      res += `.${normalizedMoney?.substring(i, i + 3)}`;
    }
    realMoney = res;
  } else {
    let res = normalizedMoney?.substring(0, 2);
    for (let i = 2; i < length; i += 3) {
      res += `.${normalizedMoney?.substring(i, i + 3)}`;
    }
    realMoney = res;
  }

  if (money < 0) {
    return `-${realMoney}`;
  }

  return `${realMoney}`;
};

export const isIphoneX = () => {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
};
export const normalizeCardNumber = cardNumber =>
  cardNumber.toString().replace(/\s/g, '');
export const formatCardBankNumber = cardNumber => {
  const normalizedCardNumber = normalizeCardNumber(cardNumber);
  if (normalizedCardNumber.length <= 4) return normalizedCardNumber;

  let res = normalizedCardNumber.substring(0, 4);
  for (let i = 4; i < normalizedCardNumber.length; i += 4) {
    res += ` ${normalizedCardNumber.substring(i, i + 4)}`;
  }
  return res;
};

export const capitalizeFirstLetter = s => s[0].toUpperCase() + s.slice(1);

export const unnormText = text => {
  let normalizedText = '';

  normalizedText = text
    ? unorm
        .nfd(text)
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/\u00a0/g, '\u0020')
    : '';
  return normalizedText.split('').join('');
};

export function ifIphoneX(iphoneXStyle, regularStyle) {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

export function getStatusBarHeight(safe) {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 30, 20),
    android: StatusBar.currentHeight,
    default: 0,
  });
}

export function getBottomSpace() {
  return isIphoneX() ? 34 : 0;
}

export function subLongStr(str, length) {
  return str?.length > length ? str.substring(0, length) + '...' : str;
}

export const isSmallDevice = () => {
  return D_HEIGHT <= 680;
};

export const isMeidumDevice = () => {
  return D_HEIGHT <= 736;
};

export const standardPadding = () => {
  let padding;
  if (isMeidumDevice()) {
    padding = 130;
  } else if (isSmallDevice()) {
    padding = 162;
  } else {
    padding = 98;
  }

  return padding;
};

export const makeCancelable = promise => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error)),
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export const getRandomNumber = () => {
  return getRndInteger(1, 99) + Date.now();
};
