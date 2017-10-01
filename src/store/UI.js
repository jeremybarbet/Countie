import { observable } from 'mobx';

import { datify } from '../utils/date';

export default class UIStore {

  @observable
  timeRemaining = undefined;

  @observable
  showDate = false;

  @observable
  date = {};

  @observable
  counter = {
    from: undefined,
    to: new Date(),
    text: undefined,
  };

  timeDifference(closed, opened) {
    const converted = typeof closed === 'string'
      ? new Date(Date.parse(closed))
      : closed;

    const diff = opened.getTime() - converted.getTime();
    const newTotal = this.timeRemaining - diff;
    const date = datify(newTotal);

    this.date = date;
  }
}
