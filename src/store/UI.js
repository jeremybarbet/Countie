import { observable, action } from 'mobx';

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
  counters = {};

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

  @action
  updateDate(c, { ...args }) {
    return timeDiff(args);
  }
}
