import { observable } from 'mobx';

import { datify } from '../utils/date';

export default class UIStore {

  timeDifference() {
    const diff = this.lastOpened.getTime() - this.lastClosed.getTime();
    const newTotal = this.timeRemaining - diff;
    const date = datify(newTotal);

    this.date = date;
  }

  @observable
  lastClosed = null;

  @observable
  lastOpened = null;

  @observable
  timeRemaining = null;

  @observable
  date = {};
}
