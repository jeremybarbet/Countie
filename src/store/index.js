import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'mobx-react/native';
import moment from 'moment';

import storage, { prefix } from 'utils/storage';

import UI from './UI';

export default class Store {

  ui = new UI();

  async init() {
    try {
      const permission = await storage.get(prefix('permission'));

      this.ui.permission = permission;

      if (permission !== null) {
        const lastOpened = new Date();
        const lastClosed = await storage.get(prefix('last_closed'));
        const remaining = await storage.get(prefix('time_remaining'));

        // const from = await storage.get(prefix('from'));
        // const to = await storage.get(prefix('to'));
        // const text = await storage.get(prefix('text'));

        const counters = await storage.get(prefix('counters'));

        if (lastClosed && counters) {
          this.ui.activeCounter = true;

          Object.keys(counters).map(c => {
            const props = {
              from: moment(counters[c].from).toDate(),
              to: moment(counters[c].to).toDate(),
              text: counters[c].text,
              status: this.ui.newDate(c, { lastClosed, lastOpened, remaining }),
            };

            this.ui.props[c] = props;
          });
        } else {
          this.ui.activeCounter = false;
        }
      }
    } catch (error) {
      console.log(error) // eslint-disable-line
    }

    return {
      permission: this.ui.permission,
      active: this.ui.activeCounter,
      props: this.ui.props,
    };
  }
}

export class StoreProvider extends PureComponent {

  static propTypes = {
    store: PropTypes.object,
    children: PropTypes.node,
  };

  static defaultProps = {
    store: {},
    children: undefined,
  };

  render() {
    const { store, children } = this.props;

    return (
      <Provider ui={store.ui}>
        {children}
      </Provider>
    );
  }
}
