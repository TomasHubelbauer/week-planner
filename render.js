import calculateColor from './calculateColor.js';
import clearSelection from './clearSelection.js';
import fetchData from './fetchData.js';
import getSelection from './getSelection.js';
import iterateDates from './iterateDates.js';
import iterateSlots from './iterateSlots.js';
import slotDurationMinutes from './slotDurationMinutes.js';
import storeData from './storeData.js';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const table = document.querySelector('table');

export default function render() {
  table.replaceChildren();

  const slots = [...getSelection()];
  if (slots.length > 0) {
    const slotsSpan = document.querySelector('#slotsSpan');
    slotsSpan.textContent = `${slots.length} slot${slots.length > 1 ? 's' : ''}`;
  }

  const types = fetchData('types', []);
  for (const date of iterateDates()) {
    const tr = document.createElement('tr');

    const th = document.createElement('th');
    th.textContent = dayNames[date.getDay()];
    tr.draggable = false;
    tr.append(th);

    for (const slot of iterateSlots(date)) {
      const td = document.createElement('td');
      const data = fetchData(slot, {});
      td.classList.toggle('selected', data.isSelected === true);
      if (data.type) {
        td.style.background = calculateColor(data.type);
      }

      // Support single-click selection
      td.addEventListener('mousedown', event => {
        if (event.buttons !== 1) {
          return;
        }

        clearSelection();

        td.classList.toggle('selected', true);
        storeData(slot, data => data.isSelected = true, {});
      });

      // Support drag multi-selection
      td.addEventListener('mousemove', event => {
        if (event.buttons !== 1) {
          return;
        }

        td.classList.toggle('selected', true);
        storeData(slot, data => data.isSelected = true, {});
      });

      td.addEventListener('mouseover', () => {
        const _slot = new Date(slot);
        _slot.setMinutes(_slot.getMinutes() + slotDurationMinutes);
        const from = slot.toISOString().slice('yyyy-mm-dd '.length, 'yyyy-mm-dd hh:mm'.length);
        const to = _slot.toISOString().slice('yyyy-mm-dd '.length, 'yyyy-mm-dd hh:mm'.length);

        const slotSpan = document.querySelector('#slotSpan');
        slotSpan.textContent = `${dayNames[date.getDay()]} ${from}-${to}`;

        const data = fetchData(slot);
        if (data && data.type) {
          slotSpan.append(' ', data.type);
        }
      });

      td.addEventListener('mouseout', () => {
        const slotSpan = document.querySelector('#slotSpan');
        slotSpan.textContent = '';
      });

      tr.append(td);
    }

    table.append(tr);
  }

  table.addEventListener('mouseup', () => render());
}
