import { observable } from 'mobx';

import { datify } from 'utils/date';

export default class UIStore {

  @observable
  activeCounter = false;

  @observable
  props = {};

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

  @observable
  reload = false;

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
