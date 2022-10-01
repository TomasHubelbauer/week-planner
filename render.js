import calculateColor from './calculateColor.js';
import fetchData from './fetchData.js';
import iterateDates from './iterateDates.js';
import iterateSlots from './iterateSlots.js';
import slotDurationMinutes from './slotDurationMinutes.js';
import storeData from './storeData.js';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const table = document.querySelector('table');

let focusType;

table.addEventListener('mouseup', () => {
  // Ignore selection-end events in readonly/focus mode
  if (focusType) {
    return;
  }

  const slots = [];
  for (const date of iterateDates()) {
    for (const slot of iterateSlots(date)) {
      const data = fetchData(slot, {});
      if (data.isSelected) {
        slots.push(slot);
      }
    }
  }

  const slotsSpan = document.querySelector('#slotsSpan');
  slotsSpan.textContent = `${slots.length} slot${slots.length > 1 ? 's' : ''}`;

  if (slots.length === 0) {
    return;
  }

  const type = prompt('Type:');
  if (type !== null && !type.split(' ')[0].endsWith('ing')) {
    alert('The first word of the annotation is not a continuous time verb!');
  }

  for (const slot of slots) {
    storeData(slot, data => {
      data.isSelected = false;
      if (type) {
        data.type = type;
      }
    });
  }

  render();
});

export default function render() {
  table.replaceChildren();

  const types = {};

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
        const type = data.type.split(' ')[0];
        types[type] ??= 0;
        types[type]++;

        if (!focusType || type === focusType) {
          td.style.background = calculateColor(type);
        }
      }

      // Support single-click selection
      td.addEventListener('mousedown', event => {
        // Ensure left-click is pressed and table is not in readonly/focus mode
        if (event.buttons !== 1 || focusType) {
          return;
        }

        td.classList.toggle('selected', true);
        storeData(slot, data => data.isSelected = true, {});
      });

      // Support drag multi-selection
      td.addEventListener('mousemove', event => {
        // Ensure left-click is pressed and table is not in readonly/focus mode
        if (event.buttons !== 1 || focusType) {
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

  const caption = document.createElement('caption');
  for (const type of Object.keys(types).sort()) {
    const slots = types[type];

    const span = document.createElement('span');
    span.style.borderColor = calculateColor(type);
    span.classList.toggle('focused', focusType === type);
    span.textContent = type;

    span.addEventListener('click', () => {
      focusType = focusType === type ? undefined : type;
      render();
    });

    let minutes = slots * slotDurationMinutes;
    const hours = ~~(minutes / 60);
    minutes -= hours * 60;

    const time = document.createElement('time');
    time.textContent = `${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}`;

    span.append(time);
    caption.append(span);
  }

  table.append(caption);
}
