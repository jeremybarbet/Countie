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
    this.counters[c].status = timeDiff(args);

    return timeDiff(args);
  }
}
