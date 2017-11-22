import { observable, action } from 'mobx';

import { timeDiff } from 'utils/date';

export default class UI {

  @observable
  permission = 'waiting';

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

  @action
  newDate({ ...args }) {
    this.date = timeDiff(args);
  }
}
