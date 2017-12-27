import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'mobx-react/native';
import moment from 'moment';

import storage, { prefix } from 'utils/storage';
import { timeDiff } from 'utils/date';

import UI from './UI';

export default class Store {

  ui = new UI();

  async init() {
    const lastOpened = new Date();

    try {
      const permission = await storage.get(prefix('permission'));

      this.permission = permission;

      if (permission !== null) {
        const lastClosed = await storage.get(prefix('last_closed'));
        const counters = await storage.get(prefix('counters'));

        if (lastClosed && counters) {
          this.ui.lastClosed = lastClosed;
          this.ui.currentCounter = Object.keys(counters)[0]; // eslint-disable-line

          Object.keys(counters).forEach((c) => {
            const counter = counters[c];

            this.ui.counters.set(c, {
              from: moment(counter.from).toDate(),
              to: moment(counter.to).toDate(),
              text: counter.text,
              status: timeDiff({
                lastClosed,
                lastOpened,
                remaining: counter.status.total,
              }),
            });
          });
        }
      }
    } catch (error) {
      console.error(`Error when trying to initialize store ${error}`);
    }

    return {
      permission: this.permission,
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
