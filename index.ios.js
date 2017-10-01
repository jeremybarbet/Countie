import React, { PureComponent } from 'react';
import { AppRegistry } from 'react-native';
import { NavigationProvider, StackNavigation } from '@expo/ex-navigation';
import { Provider as MobxProvider } from 'mobx-react/native';

import Router from './src/screens';
import { UI } from './src/store';

export default class App extends PureComponent {

  ui = new UI();

  render() {
    return (
      <MobxProvider ui={this.ui}>
        <NavigationProvider router={Router}>
          <StackNavigation
            initialRoute="welcome"
            defaultRouteConfig={{ styles: { gestures: null } }}
          />
        </NavigationProvider>
      </MobxProvider>
    );
  }
}

AppRegistry.registerComponent('countie', () => App);
