import React, { PureComponent } from 'react';
import { AppRegistry } from 'react-native';
import { NavigationProvider, StackNavigation } from '@expo/ex-navigation';

import Router from './src/screens';

export default class App extends PureComponent {

  render() {
    return (
      <NavigationProvider router={Router}>
        <StackNavigation initialRoute="welcome" />
      </NavigationProvider>
    );
  }
}

AppRegistry.registerComponent('countie', () => App);
