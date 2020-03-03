import { Dimensions, Platform, StatusBar } from 'react-native';
import unorm from 'unorm';

export const mapValue = (object, iteratee) => {
  object = Object(object);
  const result = {};

  Object.keys(object).forEach(key => {
    result[key] = iteratee(object[key], key, object);
  });
  return result;
};

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
export const showProvider = attributes => {
  if (attributes && attributes.length !== 0) {
    const index = attributes.findIndex(
      item =>
        item.transactionAttributeValue === 'VTM' ||
        item.transactionAttributeValue === 'VNP' ||
        item.transactionAttributeValue === 'VMS' ||
        item.transactionAttributeValue === 'GMOBILE' ||
        item.transactionAttributeValue === 'VNM' ||
        item.transactionAttributeValue === 'VINPLAY' ||
        item.transactionAttributeValue === 'ZING' ||
        item.transactionAttributeValue === 'GARENA' ||
        item.transactionAttributeValue === 'GATE' ||
        item.transactionAttributeValue === 'VCOIN' ||
        item.transactionAttributeValue === 'ONCASH' ||
        item.transactionAttributeValue === 'ANPAY' ||
        item.transactionAttributeValue === 'DT_VTM' ||
        item.transactionAttributeValue === 'DT_VNP' ||
        item.transactionAttributeValue === 'DT_VMS',
    );
    if (index === -1) {
      return null;
    }
    switch (attributes[index].transactionAttributeValue) {
      case 'VTM':
        return 'VIETTEL';
      case 'VNP':
        return 'VINAPHONE';
      case 'VMS':
        return 'MOBIFONE';
      case 'GMOBILE':
        return 'GMOBILE';
      case 'VNM':
        return 'VNMOBILE';
      case 'GARENA':
        return 'GARENA';
      case 'ZING':
        return 'ZING';
      case 'VINPLAY':
        return 'VINPLAY';
      case 'GATE':
        return 'GATE';
      case 'VCOIN':
        return 'VTC';
      case 'ONCASH':
        return 'ONCASH';
      case 'ANPAY':
        return 'ANPAY';
      case 'DT_VTM':
        return 'VIETTEL DATA';
      case 'DT_VNP':
        return 'VINAPHONE DATA';
      case 'DT_VMS':
        return 'MOBIFONE DATA';
      default:
        break;
    }
  }
  return '';
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
