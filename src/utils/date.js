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
  const isZero = v => date[v] === 0;
  const goingToEnd = date.seconds === 1;

  if (isZero('days') && isZero('hours') && isZero('minutes') && goingToEnd) {
    return true;
  }

  return false;
}
