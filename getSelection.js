import iterateDates from './iterateDates.js';
import iterateSlots from './iterateSlots.js';

export default function* getAllSlots() {
  for (const date of iterateDates()) {
    for (const slot of iterateSlots(date)) {
      yield slot;
    }
  }
}
