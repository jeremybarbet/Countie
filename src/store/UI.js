import { observable } from 'mobx';

import { datify } from '../utils/date';

export default class UIStore {

  timeDifference(closed, opened) {
    const converted = typeof closed === 'string'
      ? new Date(Date.parse(closed))
      : closed;

    const diff = opened.getTime() - converted.getTime();
    const newTotal = this.timeRemaining - diff;
    const date = datify(newTotal);

    this.date = date;
  }

  @observable
  counterActive = false;

  @observable
  timeRemaining = null;

  @observable
  date = {};
}
