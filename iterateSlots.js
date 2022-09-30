import slotDurationMinutes from './slotDurationMinutes.js';

/**
 * 
 * @param {Date} date 
 */
export default function* iterateSlots(date) {
  if (date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0 || date.getMilliseconds() !== 0) {
    throw new Error('Date must be at midnight!');
  }

  for (let minute = 0; minute < 24 * 60; minute += slotDurationMinutes) {
    const _date = new Date(date);
    _date.setMinutes(minute);
    yield _date;
  }
}
