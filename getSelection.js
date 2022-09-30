import fetchData from './fetchData.js';
import iterateDates from './iterateDates.js';
import iterateSlots from './iterateSlots.js';

export default function* getSelection() {
  for (const date of iterateDates()) {
    for (const slot of iterateSlots(date)) {
      const data = fetchData(slot, {});
      if (data.isSelected) {
        yield slot;
      }
    }
  }
}
