import { observable, action } from 'mobx';

import { timeDiff } from 'utils/date';

export default class UI {

  @observable
  permission = 'waiting';

  @observable
  activeCounter = false;

  @observable
  currentCounter = undefined;

  @observable
  counters = {};

  @observable
  reload = false;

  @action
  updateDate(c, { ...args }) {
    console.log('-c', c)
    console.log('-args', args)
    // console.log('-this.counters', this.counters[c])

    const diff = timeDiff(args);

    this.counters[c].status = diff;

    return diff;
  }
}
