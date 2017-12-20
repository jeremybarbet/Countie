export function datify(total) {
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

export function isOver(date) {
  const isZero = v => date[v] <= 0;

  if (isZero('days') && isZero('hours') && isZero('minutes') && isZero('seconds')) {
    return true;
  }

  return false;
}

export function timeDiff({ lastClosed, lastOpened, remaining }) {
  const closed = typeof lastClosed === 'string' ? new Date(Date.parse(lastClosed)) : lastClosed;
  const opened = typeof lastOpened === 'string' ? new Date(Date.parse(lastOpened)) : lastOpened;
  const diff = opened.getTime() - closed.getTime();
  const newTotal = remaining - diff;
  const date = datify(newTotal);

  if (isOver(date)) {
    return datify(0);
  }

  return date;
}
