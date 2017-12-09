import { observable, action, ObservableMap, computed } from 'mobx';

import { timeDiff } from 'utils/date';

export default class UI {

  // Global

  @observable
  permission = 'waiting';

  @observable
  reload = false;

  // Counters

  @observable
  activeCounter = false;

  @observable
  currentCounter = undefined;

  @observable
  counters = new ObservableMap();

  // Inputs

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

  // Actions

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
  updateStatus = (id, { lastClosed, lastOpened, remaining }) => // eslint-disable-line
    this.getCounter(id).status = this.updateDate({ lastClosed, lastOpened, remaining });

  @action
  updateDate = ({ ...args }) => timeDiff(args);
}
