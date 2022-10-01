import slotDurationMinutes from './slotDurationMinutes.js';

/**
 * 
 * @param {Date[]} slots 
 */
export default function calculateRanges(_slots) {
  const slots = [..._slots];
  slots.sort();

  const ranges = [];
  let range;
  for (let index = 0; index < slots.length - 1; index++) {
    const difference = (slots[index + 1] - slots[index]) / 1000 / 60;
    if (difference === slotDurationMinutes) {
      if (!range) {
        range = { start: slots[index] };
        ranges.push(range);
      }

      range.end = slots[index + 1];
    }
    else {
      range = { start: slots[index + 1] };
      ranges.push(range);
    }
  }

  for (const range of ranges) {
    range.start = new Date(range.start);
    range.end ??= range.start;
    range.end = new Date(range.end);
    range.end.setMinutes(range.end.getMinutes() + slotDurationMinutes);

    if (range.start.getFullYear() === range.end.getFullYear() && range.start.getMonth() === range.end.getMonth() && range.start.getDate() === range.end.getDate()) {
      range.name = `${range.start.toISOString().slice(0, 'yyyy-mm-dd hh:mm'.length)}-${range.end.toISOString().slice('yyyy-mm-dd '.length, 'yyyy-mm-dd hh:mm'.length)}`.replace('T', ' ');
    }
    else {
      range.name = `${range.start.toISOString().slice(0, 'yyyy-mm-dd hh:mm'.length)}-${range.end.toISOString().slice(0, 'yyyy-mm-dd hh:mm'.length)}`.replace(/T/g, ' ');
    }
  }

  return ranges;
}
