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
        const remaining = await storage.get(prefix('time_remaining')); // should be for each counter
        const counters = await storage.get(prefix('counters'));

        if (lastClosed && counters) {
          console.log('-inside')

          this.ui.activeCounter = true;

          Object.keys(counters).forEach((c) => { // eslint-disable-line
            this.ui.counters[c] = {};
            this.ui.counters[c].from = moment(counters[c].from).toDate();
            this.ui.counters[c].to = moment(counters[c].to).toDate();
            this.ui.counters[c].text = counters[c].text;
            this.ui.counters[c].status = this.ui.updateDate(c, { lastClosed, lastOpened, remaining: remaining[c] });
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
