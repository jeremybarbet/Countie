import { observable } from 'mobx';

import { datify } from '../utils/date';

export default class UIStore {

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

  timeDifference(closed, opened, remaining) {
    const converted = typeof closed === 'string'
      ? new Date(Date.parse(closed))
      : closed;

    const diff = opened.getTime() - converted.getTime();
    const newTotal = remaining - diff;
    const date = datify(newTotal);

    this.date = date;
  }
}
