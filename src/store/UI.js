import { observable, action, ObservableMap, computed } from 'mobx';
import { persist } from 'mobx-persist';

import { timeDiff } from 'utils/date';

export default class UI {

  @persist
  @observable
  permission = 'waiting';

  @observable
  reload = false;

  @persist('object')
  @observable
  lastClosed;

  @persist('object')
  @observable
  lastOpened;

  @persist
  @observable
  currentCounter = undefined;

  @persist('map')
  @observable
  counters = new ObservableMap();

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
  updateStatus = (id, { lastClosed, lastOpened, remaining }) => // eslint-disable-line
    this.getCounter(id).status = this.updateDate({ lastClosed, lastOpened, remaining });

  @action
  updateDate = ({ ...args }) => timeDiff(args);

  @action
  setAndroidDate = (date) => {
    this.counterTo = date;
    this.firstPickDate = true;
    this.showDate = true;
  }
}
