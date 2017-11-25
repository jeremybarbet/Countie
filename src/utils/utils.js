import { Dimensions, Platform } from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

function isIphoneX() {
  const { height, width } = Dimensions.get('window');

  return Platform.OS === 'ios' && ((height === X_HEIGHT && width === X_WIDTH) || (height === X_WIDTH && width === X_HEIGHT));
}

export default isIphoneX;
