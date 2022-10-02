import calculateColor from './calculateColor.js';
import calculateRanges from './calculateRanges.js';
import fetchData from './fetchData.js';
import getAllSlots from './getAllSlots.js';
import iterateDates from './iterateDates.js';
import iterateSlots from './iterateSlots.js';
import slotDurationMinutes from './slotDurationMinutes.js';
import storeData from './storeData.js';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const table = document.querySelector('table');
const slotDiv = document.querySelector('#slotDiv');
const rangeDiv = document.querySelector('#rangeDiv');
const typeInput = document.querySelector('#typeInput');
const typeDatalist = document.querySelector('#typeDatalist');
const typeDiv = document.querySelector('#typeDiv');
const minimumInput = document.querySelector('#minimumInput');
const maximumInput = document.querySelector('#maximumInput');
const visibleInput = document.querySelector('#visibleInput');

let focusType;

table.addEventListener('mouseup', () => {
  // Ignore selection-end events in readonly/focus mode
  if (focusType) {
    return;
  }

  const slots = [];
  for (const slot of getAllSlots()) {
    const data = fetchData(slot, {});
    if (data.isSelected) {
      slots.push(slot);
    }
  }

  if (slots.length === 0) {
    return;
  }

  const ranges = calculateRanges(slots).map(range => range.name).join(', ');
  if (ranges.length > 0) {
    rangeDiv.textContent = ranges;
  }
  else if (slots.length === 1) {
    const _slot = new Date(slots[0]);
    _slot.setMinutes(_slot.getMinutes() + slotDurationMinutes);
    const from = slots[0].toISOString().slice('yyyy-mm-dd '.length, 'yyyy-mm-dd hh:mm'.length);
    const to = _slot.toISOString().slice('yyyy-mm-dd '.length, 'yyyy-mm-dd hh:mm'.length);

    rangeDiv.textContent = `${dayNames[_slot.getDay()]} ${from}-${to}`;
  }
  else {
    rangeDiv.textContent = '';
  }

  const types = slots.map(slot => fetchData(slot, {}).type).filter((type, index, array) => type && array.indexOf(type) === index);
  if (types.length === 1) {
    typeInput.value = types[0];
  }
  else {
    typeInput.value = '';
  }

  typeDatalist.replaceChildren();
  const allTypes = [];
  for (const slot of getAllSlots()) {
    const data = fetchData(slot, {});
    if (data.type) {
      allTypes.push(data.type);
    }
  }

  for (const type of allTypes.filter((type, index, array) => array.indexOf(type) === index)) {
    const option = document.createElement('option');
    option.text = type;
    typeDatalist.append(option);
  }

  slotDiv.style.display = 'initial';
  typeInput.focus();
});

typeInput.addEventListener('keydown', event => {
  if (event.key !== 'Enter' && event.key !== 'Escape') {
    return;
  }

  const slots = [];
  for (const slot of getAllSlots()) {
    const data = fetchData(slot, {});
    if (data.isSelected) {
      slots.push(slot);
    }
  }

  switch (event.key) {
    case 'Enter': {
      const type = typeInput.value;
      if (type && !type.split(' ', 2)[0].endsWith('ing')) {
        alert('The first word of the annotation is not a continuous time verb!');
      }

      for (const slot of slots) {
        storeData(slot, data => {
          data.isSelected = false;
          data.type = type;
        }, {});
      }

      break;
    }
    case 'Escape': {
      for (const slot of slots) {
        storeData(slot, data => {
          data.isSelected = false;
        }, {});
      }

      break;
    }
  }

  slotDiv.style.display = 'none';
  render();
});

minimumInput.addEventListener('input', () => {
  storeData(typeDiv.dataset['type'], data => data.minimum = minimumInput.value, {});
});

maximumInput.addEventListener('input', () => {
  storeData(typeDiv.dataset['type'], data => data.maximum = maximumInput.value, {});
});

visibleInput.addEventListener('change', () => {
  storeData(typeDiv.dataset['type'], data => data.visible = visibleInput.checked, {});
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
        const type = data.type.split(' ', 2)[0];
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
        const data = fetchData(slot);

        const _slot = new Date(slot);
        _slot.setMinutes(_slot.getMinutes() + slotDurationMinutes);
        const from = slot.toISOString().slice('yyyy-mm-dd '.length, 'yyyy-mm-dd hh:mm'.length);
        const to = _slot.toISOString().slice('yyyy-mm-dd '.length, 'yyyy-mm-dd hh:mm'.length);
        const slotSpan = document.querySelector('#slotSpan');
        slotSpan.textContent = `${dayNames[date.getDay()]} ${from}-${to}`;

        const slots = [];
        if (data && data.type) {
          for (const slot of getAllSlots()) {
            const data2 = fetchData(slot, {});
            if (data2.type?.split(' ', 2)[0] === data.type.split(' ', 2)[0]) {
              slots.push(slot);
            }
          }

          const ranges = calculateRanges(slots);
          const range = ranges.find(range => range.start <= slot && range.end >= slot);
          slotSpan.append(` (${range.name.slice('yyyy-mm-dd '.length)}) ${data.type}`);
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
    const data = fetchData(type, {});
    if (data.visible === false && !focusType) {
      continue;
    }

    const slots = types[type];

    const span = document.createElement('span');
    span.style.borderColor = calculateColor(type);
    span.classList.toggle('focused', focusType === type);
    span.textContent = type;

    span.addEventListener('click', () => {
      const rangeUl = document.querySelector('#rangeUl');
      rangeUl.replaceChildren();

      if (focusType === type) {
        focusType = undefined;
        delete typeDiv.dataset['type'];
      }
      else {
        focusType = type;
        typeDiv.dataset['type'] = type;

        const data = fetchData(type, {});
        minimumInput.value = data.minimum ?? '';
        maximumInput.value = data.maximum ?? '';
        visibleInput.checked = data.visible ?? true;

        const slots = [];
        for (const slot of getAllSlots()) {
          const data = fetchData(slot, {});
          if (data.type?.split(' ', 2)[0] === type) {
            slots.push(slot);
          }
        }

        for (const range of calculateRanges(slots)) {
          const li = document.createElement('li');
          li.textContent = range.name;
          rangeUl.append(li);
        }
      }

      render();
    });

    let minutes = slots * slotDurationMinutes;
    const hours = ~~(minutes / 60);
    minutes -= hours * 60;

    const time = document.createElement('time');
    time.textContent = `${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}`;

    span.append(time);

    if (data.minimum && data.minimum > slots * slotDurationMinutes) {
      span.append(`${data.minimum - slots * slotDurationMinutes} m under `);
    }

    if (data.maximum && data.maximum < slots * slotDurationMinutes) {
      span.append(`${slots * slotDurationMinutes - data.maximum} m over `);
    }

    caption.append(span);
  }

  table.append(caption);
}
