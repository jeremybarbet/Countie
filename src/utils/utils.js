import { Dimensions, Platform } from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;

export function isIphoneX() {
  return Platform.OS === 'ios' && ((height === X_HEIGHT && width === X_WIDTH) || (height === X_WIDTH && width === X_HEIGHT));
}

export function isIpad() {
  return aspectRatio < 1.6;
}
