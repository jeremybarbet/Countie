import React, { PureComponent } from 'react';
import { AppRegistry } from 'react-native';
import { NavigationProvider, StackNavigation } from '@expo/ex-navigation';
import { Provider as MobxProvider } from 'mobx-react/native';
import { isNil } from 'lodash';

import Router from './src/screens';
import { UI } from './src/store';
import storage from './src/utils/storage';

export default class App extends PureComponent {

  ui = new UI();

  async componentWillMount() {
    const lastOpened = new Date();

    try {
      const lastClosed = await storage.get('@countie:last_closed');

      if (lastClosed) {
        await this.ui.timeDifference(lastClosed, lastOpened);
      }
    } catch (error) {
      console.log(error) // eslint-disable-line
    }
  }

  render() {
    const isActive = storage.get('@countie:counter_active');

    return (
      <MobxProvider ui={this.ui}>
        <NavigationProvider router={Router}>
          <StackNavigation
            initialRoute={isNil(isActive) ? 'counter' : 'welcome'}
            defaultRouteConfig={{ styles: { gestures: null } }}
          />
        </NavigationProvider>
      </MobxProvider>
    );
  }
}

AppRegistry.registerComponent('countie', () => App);
