export default function* iterateDates(days = 7) {
  for (let day = 0; day < days; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    yield date;
  }
}
