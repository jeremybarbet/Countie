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
  const format = v => typeof v === 'string' ? new Date(Date.parse(v)) : v;
  const diff = format(lastOpened).getTime() - format(lastClosed).getTime();
  const date = datify(remaining - diff);

  if (isOver(date)) {
    return datify(0);
  }

  return date;
}
