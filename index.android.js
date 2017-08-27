import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { NavigationProvider, StackNavigation } from '@expo/ex-navigation';

import Router from './src/screens';

export default class App extends Component {
  render() {
    return (
      <NavigationProvider router={Router}>
        <StackNavigation initialRoute="welcome" />
      </NavigationProvider>
    );
  }
}

AppRegistry.registerComponent('countie', () => App);
