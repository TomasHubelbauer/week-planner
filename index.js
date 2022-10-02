import render from './render.js';

render();

function makeEvent(name, data) {
  const event = new Event(name);
  for (const key in data) {
    event[key] = data[key];
  }

  return event;
}

// Check whether a flag file exists signalling the demo experience should engage
try {
  await import('./demo.js');

  // Clear the local storage for local development, it is always empty on the CI
  localStorage.clear();

  const table = document.querySelector('table');
  const trs = document.querySelectorAll('tr');
  const typeInput = document.querySelector('#typeInput');

  for (const tr of trs) {
    const tds = tr.querySelectorAll('td');

    // Make the first 48 slots (8 hours of 6 10-minute slots) as "sleeping"
    for (let index = 0; index < 48; index++) {
      const td = tds[index];
      td.dispatchEvent(makeEvent('mousedown', { buttons: 1 }));
    }

    table.dispatchEvent(makeEvent('mouseup'));
    typeInput.value = 'sleeping';
    typeInput.dispatchEvent(makeEvent('keydown', { key: 'Enter' }));

    // Make the next 48 slots (8 hours of 6 10-minute slots) as "coding"
    for (let index = 48; index < 96; index++) {
      const td = tds[index];
      td.dispatchEvent(makeEvent('mousedown', { buttons: 1 }));
    }

    table.dispatchEvent(makeEvent('mouseup'));
    typeInput.value = 'coding';
    typeInput.dispatchEvent(makeEvent('keydown', { key: 'Enter' }));
  }

  document.querySelector('#slotSpan').textContent = `Screenshot @ ${new Date().toISOString()}`;
}
catch (error) {

}
