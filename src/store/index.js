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
        const counters = await storage.get(prefix('counters'));

        if (lastClosed && counters) {
          this.ui.lastClosed = lastClosed;
          this.ui.currentCounter = Object.keys(counters)[0]; // eslint-disable-line

          Object.keys(counters).forEach((c) => {
            const obj = {
              from: moment(counters[c].from).toDate(),
              to: moment(counters[c].to).toDate(),
              text: counters[c].text,
              status: this.ui.updateDate({
                lastClosed,
                lastOpened,
                remaining: remaining[c],
              }),
            };

            this.ui.counters.set(c, obj);
          });
        }
      }
    } catch (error) {
      console.error(error);
    }

    return {
      permission: this.ui.permission,
      counters: this.ui.counters,
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
