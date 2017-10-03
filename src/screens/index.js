import { Navigation } from 'react-native-navigation';
import { useStrict } from 'mobx';

import Permission from './permission';
import Welcome from './welcome';
import Counter from './counter';

// Contains screen modules
export const Screens = new Map();

// Create unique const screen keys
export const PERMISSION = 'countie.Permission';
export const WELCOME = 'countie.Welcome';
export const COUNTER = 'countie.Counter';

// Map screen consts to their representive module
Screens.set(PERMISSION, () => Permission);
Screens.set(WELCOME, () => Welcome);
Screens.set(COUNTER, () => Counter);

export const startApp = (data) => {
  useStrict(true);

  startPermission();

  // if (data.active) {
  //   startCounter(data.props);
  // } else {
  //   startWelcome();
  // }
};

export const startPermission = (props) =>
  Navigation.startSingleScreenApp({
    screen: {
      screen: PERMISSION,
      navigatorStyle: { navBarHidden: true },
    },
  });

export const startCounter = (props) =>
  Navigation.startSingleScreenApp({
    screen: {
      screen: COUNTER,
      navigatorStyle: { navBarHidden: true },
    },
    passProps: props,
  });

export const startWelcome = () =>
  Navigation.startSingleScreenApp({
    screen: {
      screen: WELCOME,
      navigatorStyle: { navBarHidden: true },
    },
  });
