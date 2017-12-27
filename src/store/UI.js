import { observable, action, ObservableMap, computed } from 'mobx';

import { timeDiff } from 'utils/date';

export default class UI {

  @observable
  reload = false;

  @observable
  currentCounter = undefined;

  @observable
  counters = new ObservableMap();

  @observable
  lastClosed;

  @observable
  lastOpened;

  @observable
  showDate = false;

  @observable
  counterTo = new Date();

  @observable
  counterText = undefined;

  @observable
  firstPickDate = false;

  @observable
  firstPickText = false;

  @computed
  get all() {
    return this.counters.values().sort((a, b) => a.from - b.from);
  }

  getCounter = (id) => {
    if (this.counters.has(id)) {
      return this.counters.get(id);
    }
  }

  @action
  updateStatus = (lastOpened) => {
    if (!this.lastClosed) {
      return;
    }

    this.counters.forEach(c => // eslint-disable-line
      c.status = timeDiff({
        lastClosed: this.lastClosed,
        lastOpened,
        remaining: c.status.total,
      }),
    );
  }

  @action
  setAndroidDate = (date) => {
    this.counterTo = date;
    this.firstPickDate = true;
    this.showDate = true;
  }
}
